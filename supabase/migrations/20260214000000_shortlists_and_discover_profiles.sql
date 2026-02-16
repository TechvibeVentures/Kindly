-- Shortlists: users can save other profiles for later (Discover / Shortlist page).
CREATE TABLE public.shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, target_user_id)
);

CREATE INDEX shortlists_user_id_idx ON public.shortlists (user_id);
CREATE INDEX shortlists_target_user_id_idx ON public.shortlists (target_user_id);

ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shortlist"
ON public.shortlists FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own shortlist"
ON public.shortlists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own shortlist"
ON public.shortlists FOR DELETE
USING (auth.uid() = user_id);

-- Allow authenticated users to read other profiles (for Discover).
CREATE POLICY "Authenticated can view profiles for discover"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');
