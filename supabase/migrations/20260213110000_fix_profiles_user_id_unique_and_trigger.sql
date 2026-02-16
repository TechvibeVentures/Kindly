-- Fix 42P10: the live DB trigger does "ON CONFLICT (user_id) DO NOTHING" but profiles
-- may lack UNIQUE(user_id). Ensure the constraint exists, then align the trigger with our schema.

-- 1) Ensure profiles.user_id has a unique constraint (required for ON CONFLICT (user_id))
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 2) Replace trigger function with canonical version (full_name, no ON CONFLICT)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_role public.app_role;
BEGIN
  user_email := NEW.email;

  IF user_email LIKE '%@impactfuel.ch' THEN
    user_role := 'admin';
  ELSE
    user_role := 'user';
  END IF;

  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, user_email, NEW.raw_user_meta_data ->> 'full_name');

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);

  RETURN NEW;
END;
$$;
