import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';

export type CandidateProfile = Tables<'profiles'> & {
  // Extended fields from migration
  first_name?: string | null;
  gender?: 'male' | 'female' | 'non-binary' | null;
  age?: number | null;
  city?: string | null;
  country?: string | null;
  nationality?: string | null;
  languages?: string[] | null;
  looking_for?: string | null;
  vision?: string | null;
  values?: string[] | null;
  parenting_philosophy?: string | null;
  involvement?: string | null;
  involvement_flexibility?: string | null;
  preferred_method?: 'natural' | 'assisted' | 'open' | null;
  open_to_relocation?: boolean | null;
  relationship_status?: string | null;
  parenting_status?: string | null;
  occupation?: string | null;
  education?: string | null;
  financial_situation?: string | null;
  lifestyle_rhythm?: string | null;
  family_support?: string | null;
  smoking?: string | null;
  alcohol?: string | null;
  exercise?: string | null;
  diet?: string | null;
  cannabis?: string | null;
  drugs?: string | null;
  height?: number | null;
  weight?: number | null;
  religion?: string | null;
  politics?: string | null;
  ethnicity?: string | null;
  star_sign?: string | null;
  pets?: string | null;
  is_public?: boolean | null;
  is_active?: boolean | null;
};

/**
 * Get all public candidate profiles for Discover (any gender).
 * Excludes the signed-in user's own profile by user_id and profile id.
 */
export async function getAllCandidates(): Promise<CandidateProfile[]> {
  // Get current user ID and profile ID to exclude own profile
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  // Get current user's profile ID to exclude
  let currentUserProfileId: string | null = null;
  if (currentUserId) {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', currentUserId)
      .maybeSingle();
    currentUserProfileId = userProfile?.id || null;
  }

  let query = supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .eq('is_active', true);

  // Exclude current user's own profile - use OR condition to handle both user_id and profile id
  if (currentUserId || currentUserProfileId) {
    // Build exclusion filter: exclude if user_id matches OR if profile id matches
    if (currentUserId && currentUserProfileId) {
      // Exclude by both user_id and profile id
      query = query.neq('user_id', currentUserId).neq('id', currentUserProfileId);
    } else if (currentUserId) {
      // Only exclude by user_id
      query = query.neq('user_id', currentUserId);
    } else if (currentUserProfileId) {
      // Only exclude by profile id
      query = query.neq('id', currentUserProfileId);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
  
  // Log for debugging
  console.log(`Found ${data?.length || 0} public, active profiles before filtering`);
  console.log(`Current user ID: ${currentUserId}, Profile ID: ${currentUserProfileId}`);
  
  // Additional client-side filter to ensure own profile is excluded (safety net)
  const filtered = (data || []).filter(p => {
    // Exclude if user_id matches OR if profile id matches
    const isOwnProfile = (currentUserId && p.user_id === currentUserId) || 
                         (currentUserProfileId && p.id === currentUserProfileId);
    return !isOwnProfile;
  });
  
  if (filtered.length !== (data?.length || 0)) {
    console.log(`Filtered out ${(data?.length || 0) - filtered.length} own profile(s)`);
  }
  
  console.log(`Returning ${filtered.length} public, active profiles (excluding own profile)`);
  return filtered as CandidateProfile[];
}

/**
 * Get a candidate by ID
 * RLS policies will handle access control:
 * - Users can view their own profile
 * - Anyone can view public profiles (is_public = true AND is_active = true)
 * - Admins can view all profiles
 */
export async function getCandidateById(id: string): Promise<CandidateProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching candidate by ID:', error);
    throw error;
  }
  
  return data as CandidateProfile | null;
}

/**
 * Search candidates with filters
 */
export interface CandidateFilters {
  ageRange?: [number, number];
  city?: string;
  country?: string;
  gender?: 'male' | 'female' | 'non-binary';
  languages?: string[];
  preferredMethod?: 'natural' | 'assisted' | 'open';
  openToRelocation?: boolean;
}

export async function searchCandidates(filters: CandidateFilters = {}): Promise<CandidateProfile[]> {
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .eq('is_active', true);

  if (filters.ageRange) {
    query = query.gte('age', filters.ageRange[0]).lte('age', filters.ageRange[1]);
  }

  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`);
  }

  if (filters.country) {
    query = query.eq('country', filters.country);
  }

  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }

  if (filters.preferredMethod) {
    query = query.eq('preferred_method', filters.preferredMethod);
  }

  if (filters.openToRelocation !== undefined) {
    query = query.eq('open_to_relocation', filters.openToRelocation);
  }

  if (filters.languages && filters.languages.length > 0) {
    query = query.contains('languages', filters.languages);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as CandidateProfile[];
}

