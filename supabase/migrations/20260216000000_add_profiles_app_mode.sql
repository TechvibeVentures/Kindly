-- App mode: seeker (looking for a co-parent) vs candidate (being discovered).
-- Drives nav and which flows the user sees.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS app_mode TEXT NOT NULL DEFAULT 'seeker'
CHECK (app_mode IN ('seeker', 'candidate'));

COMMENT ON COLUMN public.profiles.app_mode IS 'Product role: seeker (browsing) or candidate (being discovered).';
