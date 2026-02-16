-- Validate invitation by code without exposing all invitation rows.
-- Replaces permissive SELECT policy with a single RPC for security.
CREATE OR REPLACE FUNCTION public.get_invitation_by_code(invite_code TEXT)
RETURNS TABLE (
  id UUID,
  code TEXT,
  email TEXT,
  name TEXT,
  status invitation_status,
  expires_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.id, i.code, i.email, i.name, i.status, i.expires_at
  FROM public.invitations i
  WHERE i.code = invite_code
    AND i.status = 'pending'
    AND i.expires_at > NOW();
$$;

-- Remove policy that allowed any user to SELECT all invitation rows
DROP POLICY IF EXISTS "Anyone can view invitation by code for validation" ON public.invitations;

-- Allow anon and authenticated to call the RPC (no direct SELECT on invitations for non-admins)
GRANT EXECUTE ON FUNCTION public.get_invitation_by_code(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_invitation_by_code(TEXT) TO authenticated;

-- Let the newly signed-up user mark an invitation as accepted (no direct UPDATE for non-admins)
CREATE OR REPLACE FUNCTION public.accept_invitation(invite_code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv_id UUID;
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  SELECT i.id INTO inv_id
  FROM public.invitations i
  WHERE i.code = invite_code AND i.status = 'pending' AND i.expires_at > NOW();
  IF inv_id IS NULL THEN
    RETURN NULL;
  END IF;
  UPDATE public.invitations
  SET status = 'accepted', accepted_by = uid, accepted_at = NOW()
  WHERE id = inv_id;
  RETURN inv_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_invitation(TEXT) TO authenticated;
