-- Extend get_invitation_by_code to also return invitations accepted by the current user
-- (so logged-in users can be redirected when they revisit an already-used invitation link)
-- Must DROP first - return type changed (added accepted_by)
DROP FUNCTION IF EXISTS public.get_invitation_by_code(TEXT);

CREATE FUNCTION public.get_invitation_by_code(invite_code TEXT)
RETURNS TABLE (
  id UUID,
  code TEXT,
  email TEXT,
  name TEXT,
  status invitation_status,
  expires_at TIMESTAMPTZ,
  accepted_by UUID
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.id, i.code, i.email, i.name, i.status, i.expires_at, i.accepted_by
  FROM public.invitations i
  WHERE i.code = invite_code
    AND (
      -- Pending and not expired (for new signups)
      (i.status = 'pending' AND i.expires_at > NOW())
      OR
      -- Accepted by current user (for redirect when revisiting used link)
      (i.status = 'accepted' AND i.accepted_by = auth.uid())
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_invitation_by_code(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_invitation_by_code(TEXT) TO authenticated;
