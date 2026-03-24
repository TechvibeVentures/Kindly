-- Case-insensitive, trimmed invitation code matching (signup + accept).
-- Re-upsert COPA2026 and add ZURI2026 as campaign codes (run against DB where seed never ran).

CREATE OR REPLACE FUNCTION public.get_invitation_by_code(invite_code text)
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
  WHERE invite_code IS NOT NULL
    AND btrim(invite_code) <> ''
    AND lower(btrim(i.code)) = lower(btrim(invite_code))
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

CREATE OR REPLACE FUNCTION public.accept_invitation(invite_code text)
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

  IF invite_code IS NULL OR btrim(invite_code) = '' THEN
    RETURN NULL;
  END IF;

  SELECT * INTO inv
  FROM public.invitations i
  WHERE lower(btrim(i.code)) = lower(btrim(invite_code))
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

-- Ensure both promo campaign codes exist and are valid for signup
INSERT INTO public.invitations (
  code,
  name,
  status,
  expires_at,
  invitation_kind,
  max_redemptions,
  redemption_count,
  from_public_request,
  created_by
)
VALUES
  (
    'COPA2026',
    'COPA 2026 promotion',
    'pending',
    TIMESTAMPTZ '2026-12-31 23:59:59+00',
    'campaign',
    NULL,
    0,
    false,
    NULL
  ),
  (
    'ZURI2026',
    'ZURI 2026 promotion',
    'pending',
    TIMESTAMPTZ '2026-12-31 23:59:59+00',
    'campaign',
    NULL,
    0,
    false,
    NULL
  )
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  status = 'pending',
  expires_at = EXCLUDED.expires_at,
  invitation_kind = EXCLUDED.invitation_kind,
  max_redemptions = EXCLUDED.max_redemptions,
  from_public_request = false;
