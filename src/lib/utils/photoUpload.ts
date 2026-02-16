/**
 * Photo upload utility for Supabase Storage
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a photo to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user ID (for folder organization)
 * @returns The public URL of the uploaded photo
 */
export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  // Path must be {userId}/{filename} - RLS checks (storage.foldername(name))[1] = auth.uid()
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Failed to upload photo: ${uploadError.message}`);
  }

  // Get public URL (path is relative to bucket)
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Delete a photo from Supabase Storage
 * @param filePath - The path to the file in storage
 */
export async function deletePhoto(filePath: string): Promise<void> {
  // Extract path from URL if full URL is provided
  const path = filePath.includes('avatars/') 
    ? filePath.split('avatars/')[1] 
    : filePath;

  const { error } = await supabase.storage
    .from('avatars')
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete photo: ${error.message}`);
  }
}


