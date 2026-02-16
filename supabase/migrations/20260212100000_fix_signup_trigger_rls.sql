-- Fix "Database error saving new user": allow the signup trigger to insert into
-- profiles and user_roles. The trigger runs in a backend context where auth.uid()
-- is not set, so the normal "user inserts own row" policies block the insert.

-- Allow the trigger (running as postgres/definer) to create a profile on signup
CREATE POLICY "Allow signup trigger to insert profile"
ON public.profiles FOR INSERT
WITH CHECK (
  current_user = 'postgres'
  OR current_user = 'authenticator'
  OR current_user = 'supabase_auth_admin'
);

-- Allow the trigger to assign role on signup (no other INSERT policy existed for user_roles)
CREATE POLICY "Allow signup trigger to insert role"
ON public.user_roles FOR INSERT
WITH CHECK (
  current_user = 'postgres'
  OR current_user = 'authenticator'
  OR current_user = 'supabase_auth_admin'
);
