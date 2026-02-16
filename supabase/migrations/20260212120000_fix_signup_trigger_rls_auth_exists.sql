-- Allow insert only when the row's user_id exists in auth.users (trigger runs right after user creation).
-- Only the Auth backend can see auth.users; anon/authenticated cannot use this policy.
DROP POLICY IF EXISTS "Allow backend roles to insert profile on signup" ON public.profiles;
DROP POLICY IF EXISTS "Allow backend roles to insert role on signup" ON public.user_roles;

CREATE POLICY "Allow insert profile when user exists in auth"
ON public.profiles FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = user_id)
);

CREATE POLICY "Allow insert role when user exists in auth"
ON public.user_roles FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = user_id)
);
