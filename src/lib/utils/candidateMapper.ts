/**
 * Utility to map database CandidateProfile to Candidate interface format
 * This provides backward compatibility with existing components
 */

import type { CandidateProfile } from '@/lib/db/candidates';
import { calculateCompatibility } from './matchAlgorithm';
import { calculateProfileCompletion } from './profileCompletion';

export interface Candidate {
  id: string;
  firstName: string;
  displayName: string;
  gender: 'male' | 'female' | 'non-binary';
  age: number;
  city: string;
  country: string;
  nationality: string;
  languages: string[];
  photo: string;
  bio: string;
  lookingFor: string;
  vision: string;
  values: string[];
  parentingPhilosophy: string;
  involvement: string;
  involvementFlexibility: string;
  preferredMethod: 'natural' | 'assisted' | 'open'; // Deprecated - use conception_methods array instead
  openToRelocation: boolean;
  relationshipStatus: string;
  parentingStatus: string;
  occupation: string;
  education: string;
  financialSituation: string;
  lifestyleRhythm: string;
  familySupport: string;
  smoking: 'never' | 'occasionally' | 'regularly' | 'former';
  alcohol: 'never' | 'rarely' | 'socially' | 'regularly';
  exercise: 'daily' | 'several_weekly' | 'weekly' | 'occasionally' | 'rarely';
  diet: string;
  cannabis?: 'never' | 'sometimes' | 'often';
  drugs?: 'never' | 'sometimes' | 'often';
  height?: number;
  weight?: number;
  religion?: string;
  politics?: string;
  ethnicity?: string;
  starSign?: string;
  pets?: string;
  compatibilityScore: number;
  /** Profile completion % (how complete this candidate's profile is) */
  profileCompletion: number;
}

/**
 * Convert CandidateProfile from database to Candidate interface
 * Maps DB column names (drinking, profession, looking_for array) to Candidate format
 */
export function mapProfileToCandidate(profile: CandidateProfile): Candidate {
  const getFirstName = (name: string | null | undefined): string => {
    if (!name) return '';
    return name.split(' ')[0] || name;
  };
  // DB schema: full_name (from auth), first_name (editable), display_name
  const displayName = (profile as any).full_name || profile.first_name || (profile as any).display_name || profile.email?.split('@')[0] || 'Unknown';
  const firstName = profile.first_name || getFirstName((profile as any).full_name) || getFirstName((profile as any).display_name) || displayName.split(' ')[0] || displayName;

  // looking_for in DB can be string[] or string; looking_for_text is string
  const lookingForRaw = (profile as any).looking_for;
  const lookingFor = Array.isArray(lookingForRaw)
    ? (lookingForRaw as string[]).join(', ')
    : ((profile as any).looking_for_text || lookingForRaw || '');

  // DB has drinking, profession (occupation may also exist)
  const occupation = profile.occupation || (profile as any).profession || '';

  // Core values: DB stores in 'qualities' (onboarding), 'values' may also exist
  const values = (profile as any).qualities || profile.values || [];

  // Involvement/custody: DB has involvement_percent (number); format as "60/40 custody" etc.
  const formatInvolvement = (pct: number | null | undefined): string => {
    if (pct == null) return '';
    if (pct === 50) return '50/50 custody';
    if (pct === 60) return '60/40 custody';
    if (pct === 40) return '40/60 custody';
    if (pct === 70) return '70/30 custody';
    if (pct === 30) return '30/70 custody';
    return `${pct}/${100 - pct} custody`;
  };
  const involvement =
    profile.involvement ||
    formatInvolvement((profile as any).involvement_percent) ||
    '';

  return {
    id: profile.id,
    firstName,
    displayName: displayName || 'Unknown',
    gender: (profile.gender as 'male' | 'female' | 'non-binary') || 'non-binary',
    age: profile.age ?? 0,
    city: profile.city || '',
    country: profile.country || '',
    nationality: profile.nationality || '',
    languages: profile.languages || [],
    photo: profile.photo_url || '',
    bio: profile.bio || '',
    lookingFor,
    vision: profile.vision || '',
    values,
    parentingPhilosophy: profile.parenting_philosophy || '',
    involvement,
    involvementFlexibility: profile.involvement_flexibility || '',
    preferredMethod: 'open',
    openToRelocation: profile.open_to_relocation || false,
    relationshipStatus: profile.relationship_status || '',
    parentingStatus: profile.parenting_status || '',
    occupation,
    education: profile.education || '',
    financialSituation: profile.financial_situation || '',
    lifestyleRhythm: profile.lifestyle_rhythm || '',
    familySupport: profile.family_support || '',
    smoking: ((profile.smoking as string) || 'never') as any,
    alcohol: (((profile as any).drinking ?? profile.alcohol ?? 'never') as string) as any,
    exercise: (profile.exercise as any) || 'rarely',
    diet: profile.diet || '',
    cannabis: profile.cannabis as any,
    drugs: profile.drugs as any,
    height: profile.height || undefined,
    weight: profile.weight || undefined,
    religion: profile.religion || undefined,
    politics: profile.politics || undefined,
    ethnicity: profile.ethnicity || undefined,
    starSign: profile.star_sign || undefined,
    pets: profile.pets || undefined,
    compatibilityScore: 0,
    profileCompletion: calculateProfileCompletion(profile as any),
  };
}

/**
 * Convert array of CandidateProfile to Candidate array
 * Optionally calculates compatibility scores if userProfile is provided
 */
export function mapProfilesToCandidates(
  profiles: CandidateProfile[],
  userProfile?: any | null
): Candidate[] {
  const candidates = profiles.map(mapProfileToCandidate);
  
  // Calculate compatibility scores if user profile is provided
  if (userProfile) {
    return candidates.map(candidate => ({
      ...candidate,
      compatibilityScore: calculateCompatibility(userProfile, profiles.find(p => p.id === candidate.id)!)
    }));
  }
  
  return candidates;
}

