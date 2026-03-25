-- Promo campaign code: unlimited signups until expiry (end of 2026).
-- Signup URL: /auth?invite=COPA2026&signup=1 (code lookup is case-sensitive).
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
VALUES (
  'COPA2026',
  'COPA 2026 promotion',
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
