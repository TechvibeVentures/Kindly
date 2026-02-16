import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

// Explicit column list to avoid schema cache issues with select('*')
const PROFILE_COLUMNS = 'id, user_id, email, first_name, full_name, display_name, gender, birth_date, phone, verified, onboarding_completed, is_public, is_active, bio, photo_url, profession, company, degree, field_of_study, education, studies, school, city, country, hometown, hometown_country, languages, height, weight, exercise, drinking, smoking, cannabis, drugs, diet, vaccinated, blood_type, eye_colour, hair_colour, ethnicity, sexuality, relationship_status, household_situation, family_situation, pets, religion, politics, star_sign, interests, causes, qualities, looking_for, involvement_percent, custody_school_arrangement, custody_school_days, custody_vacation_arrangement, custody_vacation_conditions, custody_further_info, conception_methods, open_to_relocation, parenting_philosophy, financial_situation, lifestyle_rhythm, show_online_status, show_location, show_last_active, created_at, updated_at';

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Get a profile by user ID
 */
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Get a profile by ID
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', profileId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Update the current user's profile
 */
export async function updateCurrentUserProfile(updates: ProfileUpdate): Promise<Profile> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a profile for the current user
 */
export async function createProfile(profile: ProfileInsert): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all profiles (admin only)
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Search profiles by display name or email
 */
export async function searchProfiles(query: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .or(`first_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}


