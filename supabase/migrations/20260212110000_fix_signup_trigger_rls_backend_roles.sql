-- Fallback: allow any non-client role to insert on signup (Admin API may use a different role).
-- Client roles are anon and authenticated; backend (trigger) uses something else.
CREATE POLICY "Allow backend roles to insert profile on signup"
ON public.profiles FOR INSERT
WITH CHECK (current_user NOT IN ('anon', 'authenticated'));

CREATE POLICY "Allow backend roles to insert role on signup"
ON public.user_roles FOR INSERT
WITH CHECK (current_user NOT IN ('anon', 'authenticated'));
