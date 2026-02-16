/**
 * Calculate profile completion percentage
 * Based on all important fields in the profile
 */

export interface ProfileData {
  first_name?: string | null; // Primary name field
  display_name?: string | null; // Deprecated, use first_name
  full_name?: string | null; // Deprecated, use first_name
  birth_date?: string | null; // YYYY-MM-DD format
  profession?: string | null;
  languages?: string[] | null;
  ethnicity?: string | null;
  drinking?: string | null;
  smoking?: string | null;
  bio?: string | null;
  qualities?: string[] | null;
  involvement_percent?: number | null;
  photo_url?: string | null;
  // Additional fields for comprehensive calculation
  city?: string | null;
  country?: string | null;
  gender?: string | null;
  sexuality?: string | null;
  relationship_status?: string | null;
  interests?: string[] | null;
  causes?: string[] | null;
  looking_for?: string[] | null;
  parenting_philosophy?: string | null;
  financial_situation?: string | null;
  lifestyle_rhythm?: string | null;
}

/**
 * Calculate profile completion percentage
 * Returns a value between 0 and 100
 * 
 * Basic onboarding fields (Step 1-3) should result in ~30-35%
 * Additional profile fields increase from there
 */
export function calculateProfileCompletion(profile: ProfileData): number {
  if (!profile) return 0;

  // Basic onboarding fields (collected in 3-step onboarding)
  // These should account for ~30-35% of completion
  const basicOnboardingFields = [
    profile.full_name || profile.first_name || profile.display_name, // First Name
    profile.birth_date, // Birth Date (YYYY-MM-DD format)
    profile.gender, // Gender
    profile.city, // City
    profile.bio, // Bio
    profile.profession, // Profession
    profile.languages && profile.languages.length > 0, // Languages
    profile.ethnicity, // Ethnicity
    profile.drinking, // Drinking
    profile.smoking, // Smoking
    profile.qualities && profile.qualities.length >= 3, // Values (exactly 3)
    profile.involvement_percent !== null && profile.involvement_percent !== undefined, // Custody
    profile.photo_url, // Photo
  ];

  // Additional profile fields (collected in ProfileEdit)
  // These should account for the remaining ~65-70%
  const additionalFields = [
    profile.country, // Country
    profile.sexuality, // Sexuality
    profile.relationship_status, // Relationship status
    profile.interests && profile.interests.length > 0, // Interests
    profile.causes && profile.causes.length > 0, // Causes
    profile.looking_for && profile.looking_for.length > 0, // Looking for
    profile.parenting_philosophy, // Parenting philosophy
    profile.financial_situation, // Financial situation
    profile.lifestyle_rhythm, // Lifestyle rhythm
  ];

  const basicCompleted = basicOnboardingFields.filter(Boolean).length;
  const additionalCompleted = additionalFields.filter(Boolean).length;

  // Weight: Basic onboarding is 35%, additional fields are 65%
  const basicWeight = 0.35;
  const additionalWeight = 0.65;

  const basicScore = (basicCompleted / basicOnboardingFields.length) * 100;
  const additionalScore = (additionalCompleted / additionalFields.length) * 100;

  const totalScore = (basicScore * basicWeight) + (additionalScore * additionalWeight);

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

