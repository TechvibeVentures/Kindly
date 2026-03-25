-- Landing-created rows are not valid for self-serve signup until admin sends a real invite.
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS from_public_request boolean NOT NULL DEFAULT false;

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS invitation_kind text NOT NULL DEFAULT 'individual'
    CHECK (invitation_kind IN ('individual', 'campaign'));

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS max_redemptions integer NULL;

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS redemption_count integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.invitations.from_public_request IS 'True when created via public landing form; excluded from signup validation.';
COMMENT ON COLUMN public.invitations.invitation_kind IS 'individual = one signup; campaign = multi-use code.';
COMMENT ON COLUMN public.invitations.max_redemptions IS 'Campaign only: NULL = unlimited uses until expiry; N = cap.';

CREATE TABLE IF NOT EXISTS public.invitation_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (invitation_id, user_id)
);

CREATE INDEX IF NOT EXISTS invitation_redemptions_invitation_id_idx
  ON public.invitation_redemptions (invitation_id);

ALTER TABLE public.invitation_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own invitation redemptions" ON public.invitation_redemptions;
CREATE POLICY "Users read own invitation redemptions"
  ON public.invitation_redemptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP FUNCTION IF EXISTS public.get_invitation_by_code(text);
CREATE FUNCTION public.get_invitation_by_code(invite_code text)
RETURNS TABLE (
  id uuid,
  code text,
  email text,
  name text,
  status invitation_status,
  expires_at timestamptz,
  accepted_by uuid,
  invitation_kind text,
  max_redemptions integer,
  redemption_count integer,
  user_has_redeemed boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    i.id,
    i.code,
    i.email,
    i.name,
    i.status,
    i.expires_at,
    i.accepted_by,
    i.invitation_kind,
    i.max_redemptions,
    i.redemption_count,
    EXISTS (
      SELECT 1
      FROM public.invitation_redemptions r
      WHERE r.invitation_id = i.id
        AND r.user_id = auth.uid()
    ) AS user_has_redeemed
  FROM public.invitations i
  WHERE i.code = invite_code
    AND i.expires_at > now()
    AND COALESCE(i.from_public_request, false) = false
    AND (
      (
        i.invitation_kind = 'individual'
        AND (
          (i.status = 'pending')
          OR (i.status = 'accepted' AND i.accepted_by = auth.uid())
        )
      )
      OR (
        i.invitation_kind = 'campaign'
        AND i.status = 'pending'
        AND (i.max_redemptions IS NULL OR i.redemption_count < i.max_redemptions)
      )
      OR (
        i.invitation_kind = 'campaign'
        AND EXISTS (
          SELECT 1
          FROM public.invitation_redemptions r
          WHERE r.invitation_id = i.id
            AND r.user_id = auth.uid()
        )
      )
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_invitation_by_code(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_invitation_by_code(text) TO authenticated;

DROP FUNCTION IF EXISTS public.accept_invitation(text);
CREATE FUNCTION public.accept_invitation(invite_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.invitations%ROWTYPE;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO inv
  FROM public.invitations i
  WHERE i.code = invite_code
    AND i.expires_at > now()
    AND COALESCE(i.from_public_request, false) = false;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF inv.invitation_kind = 'individual' THEN
    IF inv.status <> 'pending' THEN
      RETURN NULL;
    END IF;
    UPDATE public.invitations
    SET
      status = 'accepted',
      accepted_by = uid,
      accepted_at = now(),
      redemption_count = redemption_count + 1
    WHERE id = inv.id;
    RETURN inv.id;
  END IF;

  -- campaign
  IF inv.status <> 'pending' THEN
    RETURN NULL;
  END IF;
  IF inv.max_redemptions IS NOT NULL AND inv.redemption_count >= inv.max_redemptions THEN
    RETURN NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.invitation_redemptions r
    WHERE r.invitation_id = inv.id AND r.user_id = uid
  ) THEN
    RETURN inv.id;
  END IF;

  INSERT INTO public.invitation_redemptions (invitation_id, user_id)
  VALUES (inv.id, uid);

  UPDATE public.invitations
  SET
    redemption_count = redemption_count + 1,
    status = CASE
      WHEN max_redemptions IS NOT NULL AND redemption_count + 1 >= max_redemptions
        THEN 'expired'::invitation_status
      ELSE status
    END
  WHERE id = inv.id;

  RETURN inv.id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;
