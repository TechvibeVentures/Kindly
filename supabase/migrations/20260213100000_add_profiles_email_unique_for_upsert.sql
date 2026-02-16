-- 42P10 fix: "there is no unique or exclusion constraint matching the ON CONFLICT specification"
-- Some code paths (e.g. Auth or sync) may upsert into public.profiles by email.
-- Ensure email has a unique constraint so ON CONFLICT (email) is valid.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_email_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;
