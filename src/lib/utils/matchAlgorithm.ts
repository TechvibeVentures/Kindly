/**
 * Compatibility matching algorithm
 * Calculates a match percentage (0-100) between a user profile and a candidate profile
 */

import type { CandidateProfile } from '@/lib/db/candidates';
import type { Profile } from '@/lib/db/profiles';

interface MatchFactors {
  values: number; // Core values overlap
  parentingPhilosophy: number; // Parenting philosophy similarity
  involvement: number; // Custody/involvement preferences compatibility
  lifestyle: number; // Lifestyle factors (smoking, drinking, exercise)
  languages: number; // Languages overlap
  lookingFor: number; // Looking for alignment
  interests: number; // Interests overlap
  causes: number; // Causes overlap
  location: number; // Location proximity
  age: number; // Age compatibility
}

/**
 * Calculate compatibility score between user profile and candidate profile
 * Returns a value between 0 and 100
 */
export function calculateCompatibility(
  userProfile: Profile | null,
  candidateProfile: CandidateProfile
): number {
  if (!userProfile) {
    return 0; // No match if user profile doesn't exist
  }

  const factors: MatchFactors = {
    values: calculateValuesMatch(userProfile, candidateProfile),
    parentingPhilosophy: calculateParentingPhilosophyMatch(userProfile, candidateProfile),
    involvement: calculateInvolvementMatch(userProfile, candidateProfile),
    lifestyle: calculateLifestyleMatch(userProfile, candidateProfile),
    languages: calculateLanguagesMatch(userProfile, candidateProfile),
    lookingFor: calculateLookingForMatch(userProfile, candidateProfile),
    interests: calculateInterestsMatch(userProfile, candidateProfile),
    causes: calculateCausesMatch(userProfile, candidateProfile),
    location: calculateLocationMatch(userProfile, candidateProfile),
    age: calculateAgeMatch(userProfile, candidateProfile),
  };

  // Weighted average
  // High importance: values (25%), parenting philosophy (20%), involvement (20%)
  // Medium importance: lifestyle (10%), languages (10%), looking for (10%)
  // Low importance: interests (2%), causes (2%), location (0.5%), age (0.5%)
  const weights = {
    values: 0.25,
    parentingPhilosophy: 0.20,
    involvement: 0.20,
    lifestyle: 0.10,
    languages: 0.10,
    lookingFor: 0.10,
    interests: 0.02,
    causes: 0.02,
    location: 0.005,
    age: 0.005,
  };

  let totalScore = 0;
  const totalWeight = 1; // Use full weight so missing data (0) penalizes the score

  Object.keys(factors).forEach((key) => {
    const factor = factors[key as keyof MatchFactors];
    const weight = weights[key as keyof typeof weights];
    // Treat -1 (no data) as 0 - incomplete profiles get lower scores
    const score = factor >= 0 ? factor : 0;
    totalScore += score * weight;
  });

  // Normalize to 0-100 range; missing data contributes 0, lowering the overall score
  const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  
  return Math.round(Math.min(100, Math.max(0, finalScore)));
}

/**
 * Calculate core values overlap
 * Returns 0-100 based on how many values match
 */
function calculateValuesMatch(userProfile: Profile, candidateProfile: CandidateProfile): number {
  const userValues = userProfile.qualities || [];
  // Database has 'qualities' field, but CandidateProfile may have 'values' for backward compatibility
  const candidateValues = (candidateProfile.qualities || (candidateProfile as any).values || []) as string[];

  if (userValues.length === 0 || candidateValues.length === 0) {
    return -1; // No data
  }

  const matches = userValues.filter((v) => candidateValues.includes(v)).length;
  const totalUnique = new Set([...userValues, ...candidateValues]).size;
  
  return totalUnique > 0 ? (matches / totalUnique) * 100 : 0;
}

/**
 * Calculate parenting philosophy similarity using simple text comparison
 * Returns 0-100 based on similarity
 */
function calculateParentingPhilosophyMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  const userPhilosophy = (userProfile.parenting_philosophy || '').toLowerCase().trim();
  const candidatePhilosophy = (candidateProfile.parenting_philosophy || '').toLowerCase().trim();

  if (!userPhilosophy || !candidatePhilosophy) {
    return -1; // No data
  }

  // Simple word overlap calculation
  const userWords = new Set(userPhilosophy.split(/\s+/).filter((w) => w.length > 3));
  const candidateWords = new Set(candidatePhilosophy.split(/\s+/).filter((w) => w.length > 3));
  
  if (userWords.size === 0 || candidateWords.size === 0) {
    return 50; // Default to medium match if no meaningful words
  }

  const matches = Array.from(userWords).filter((w) => candidateWords.has(w)).length;
  const totalUnique = new Set([...userWords, ...candidateWords]).size;
  
  return totalUnique > 0 ? (matches / totalUnique) * 100 : 50;
}

/**
 * Calculate involvement/custody preferences compatibility
 * Returns 0-100 based on how close the preferences are
 */
function calculateInvolvementMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  const userInvolvement = userProfile.involvement_percent ?? 50;
  
  // Parse candidate involvement from string or use involvement_percent
  let candidateInvolvement = candidateProfile.involvement_percent ?? 50;
  if (!candidateInvolvement && candidateProfile.involvement) {
    const involvementStr = candidateProfile.involvement.toLowerCase();
    if (involvementStr.includes('50/50')) candidateInvolvement = 50;
    else if (involvementStr.includes('60/40')) candidateInvolvement = 60;
    else if (involvementStr.includes('40/60')) candidateInvolvement = 40;
    else if (involvementStr.includes('70/30')) candidateInvolvement = 70;
    else if (involvementStr.includes('30/70')) candidateInvolvement = 30;
  }

  // Calculate compatibility: closer values = higher score
  const difference = Math.abs(userInvolvement - candidateInvolvement);
  const maxDifference = 50; // Maximum possible difference (0-100)
  
  return Math.max(0, 100 - (difference / maxDifference) * 100);
}

/**
 * Calculate lifestyle compatibility (smoking, drinking, exercise)
 * Returns 0-100 based on lifestyle alignment
 */
function calculateLifestyleMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  let score = 0;
  let factors = 0;

  // Smoking compatibility
  const userSmoking = userProfile.smoking || 'never';
  const candidateSmoking = candidateProfile.smoking || 'never';
  if (userSmoking && candidateSmoking) {
    factors++;
    if (userSmoking === candidateSmoking) {
      score += 100;
    } else if (
      (userSmoking === 'never' && candidateSmoking === 'former') ||
      (userSmoking === 'former' && candidateSmoking === 'never')
    ) {
      score += 80; // Never and former are compatible
    } else {
      score += 30; // Different smoking preferences
    }
  }

  // Drinking compatibility
  const userDrinking = userProfile.drinking || 'never';
  const candidateDrinking = candidateProfile.alcohol || candidateProfile.drinking || 'never';
  if (userDrinking && candidateDrinking) {
    factors++;
    if (userDrinking === candidateDrinking) {
      score += 100;
    } else if (
      (userDrinking === 'never' && candidateDrinking === 'rarely') ||
      (userDrinking === 'rarely' && candidateDrinking === 'never')
    ) {
      score += 70;
    } else {
      score += 50; // Some compatibility
    }
  }

  // Exercise compatibility
  const userExercise = userProfile.exercise || 'rarely';
  const candidateExercise = candidateProfile.exercise || 'rarely';
  if (userExercise && candidateExercise) {
    factors++;
    const exerciseLevels: Record<string, number> = {
      'daily': 5,
      'several_weekly': 4,
      'weekly': 3,
      'occasionally': 2,
      'rarely': 1,
      'active': 5,
      'sometimes': 2,
    };
    const userLevel = exerciseLevels[userExercise] || 1;
    const candidateLevel = exerciseLevels[candidateExercise] || 1;
    const difference = Math.abs(userLevel - candidateLevel);
    score += Math.max(0, 100 - difference * 20); // Closer levels = higher score
  }

  return factors > 0 ? score / factors : -1;
}

/**
 * Calculate languages overlap
 * Returns 0-100 based on shared languages
 */
function calculateLanguagesMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  const userLanguages = userProfile.languages || [];
  const candidateLanguages = candidateProfile.languages || [];

  if (userLanguages.length === 0 || candidateLanguages.length === 0) {
    return -1; // No data
  }

  const matches = userLanguages.filter((l) => candidateLanguages.includes(l)).length;
  const totalUnique = new Set([...userLanguages, ...candidateLanguages]).size;
  
  return totalUnique > 0 ? (matches / totalUnique) * 100 : 0;
}

/**
 * Calculate "looking for" alignment
 * Returns 0-100 based on alignment
 */
function calculateLookingForMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  // looking_for is an array in the database
  const userLookingFor = (userProfile.looking_for || []) as string[];
  // CandidateProfile may have looking_for as string (backward compatibility) or array
  const candidateLookingFor = Array.isArray(candidateProfile.looking_for) 
    ? candidateProfile.looking_for 
    : (candidateProfile.looking_for ? [candidateProfile.looking_for] : []);

  if (userLookingFor.length === 0 || candidateLookingFor.length === 0) {
    return -1; // No data
  }

  // Check if there's any overlap in what they're looking for
  const matches = userLookingFor.filter((l) => candidateLookingFor.includes(l)).length;
  
  if (matches > 0) {
    return 100; // Perfect match if they're looking for the same thing
  }
  
  return 50; // Partial compatibility if different but not incompatible
}

/**
 * Calculate interests overlap
 * Returns 0-100 based on shared interests
 */
function calculateInterestsMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  const userInterests = userProfile.interests || [];
  const candidateInterests: string[] = []; // CandidateProfile doesn't have interests field yet

  if (userInterests.length === 0 || candidateInterests.length === 0) {
    return -1; // No data
  }

  const matches = userInterests.filter((i) => candidateInterests.includes(i)).length;
  const totalUnique = new Set([...userInterests, ...candidateInterests]).size;
  
  return totalUnique > 0 ? (matches / totalUnique) * 100 : 0;
}

/**
 * Calculate causes overlap
 * Returns 0-100 based on shared causes
 */
function calculateCausesMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  const userCauses = userProfile.causes || [];
  const candidateCauses: string[] = []; // CandidateProfile doesn't have causes field yet

  if (userCauses.length === 0 || candidateCauses.length === 0) {
    return -1; // No data
  }

  const matches = userCauses.filter((c) => candidateCauses.includes(c)).length;
  const totalUnique = new Set([...userCauses, ...candidateCauses]).size;
  
  return totalUnique > 0 ? (matches / totalUnique) * 100 : 0;
}

/**
 * Calculate location proximity
 * Returns 0-100 based on location similarity
 */
function calculateLocationMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  const userCity = (userProfile.city || '').toLowerCase();
  const userCountry = (userProfile.country || '').toLowerCase();
  const candidateCity = (candidateProfile.city || '').toLowerCase();
  const candidateCountry = (candidateProfile.country || '').toLowerCase();

  if (!userCity && !userCountry) {
    return -1; // No data
  }

  // Same city = 100
  if (userCity && candidateCity && userCity === candidateCity) {
    return 100;
  }

  // Same country = 70
  if (userCountry && candidateCountry && userCountry === candidateCountry) {
    return 70;
  }

  // Different location = 30 (still some compatibility if open to relocation)
  if (userProfile.open_to_relocation || candidateProfile.open_to_relocation) {
    return 30;
  }

  return 10; // Low compatibility for different locations
}

/**
 * Calculate age compatibility
 * Returns 0-100 based on age difference
 */
function calculateAgeMatch(
  userProfile: Profile,
  candidateProfile: CandidateProfile
): number {
  // Calculate age from birth_date
  const calculateAge = (birthDate: string | Date | null | undefined): number | null => {
    if (!birthDate) return null;
    const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    if (isNaN(date.getTime())) return null;
    const currentYear = new Date().getFullYear();
    let age = currentYear - date.getFullYear();
    const monthDiff = new Date().getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < date.getDate())) {
      age--;
    }
    return age;
  };
  
  const userAge = calculateAge((userProfile as any).birth_date);
  const candidateAge = candidateProfile.age || calculateAge((candidateProfile as any).birth_date);

  if (!userAge || !candidateAge) {
    return -1; // No data
  }

  const ageDifference = Math.abs(userAge - candidateAge);
  
  // Age difference scoring: 0-5 years = 100, 6-10 = 80, 11-15 = 60, 16-20 = 40, 21+ = 20
  if (ageDifference <= 5) return 100;
  if (ageDifference <= 10) return 80;
  if (ageDifference <= 15) return 60;
  if (ageDifference <= 20) return 40;
  return 20;
}

