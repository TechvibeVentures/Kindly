-- Add full_name to profiles if the table was created from a template that only has first_name.
-- Trigger and app expect public.profiles.full_name.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'first_name'
    ) THEN
      UPDATE public.profiles SET full_name = first_name WHERE full_name IS NULL AND first_name IS NOT NULL;
    END IF;
  END IF;
END $$;
