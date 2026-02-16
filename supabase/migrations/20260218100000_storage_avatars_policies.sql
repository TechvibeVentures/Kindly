-- Storage: allow authenticated users to upload profile photos to avatars/{user_id}/
-- Create bucket via Dashboard (Storage → New bucket → name: avatars, Public: ON) if it doesn't exist.
-- These policies allow uploads to own folder and public read for avatar URLs.

-- Allow authenticated users to upload only to their own folder: avatars/{user_id}/...
CREATE POLICY "Allow authenticated uploads to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

-- Allow overwrite (upsert): need SELECT and UPDATE on own folder
CREATE POLICY "Allow users to update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ( (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub') )
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Allow users to select own avatar"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

-- Public read so profile photo URLs work for everyone (e.g. Discover, chat)
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'avatars' );
