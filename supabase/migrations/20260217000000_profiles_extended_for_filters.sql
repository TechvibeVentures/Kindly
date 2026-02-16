-- Extended profile fields for Discover filters and profile edit.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_year INTEGER,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS ethnicity TEXT,
  ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS looking_for TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS custody_preference INTEGER,
  ADD COLUMN IF NOT EXISTS open_to_relocation BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.birth_year IS 'Used with current year to derive age for Discover filters.';
COMMENT ON COLUMN public.profiles.custody_preference IS '0-100, for custody range filter.';
