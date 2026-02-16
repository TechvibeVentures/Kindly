import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, User, Heart, Briefcase, GraduationCap, MapPin, Home, 
  Ruler, Dumbbell, Wine, Cigarette, Baby, Users, Star,
  Landmark, Smile, MessageCircle, Sparkles, ChevronLeft,
  Palette, Eye, Dog, Droplet, Globe, Scale, Cannabis, 
  Syringe, Pill, Salad, Trash2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { allLanguages, allValues } from '@/lib/utils/candidateLabels';
import { ProfileRow } from '@/components/ProfileRow';
import { ProfileChipCard } from '@/components/ProfileChipCard';
import { ProfileSection } from '@/components/ProfileSection';
import { ProfileEditSheet } from '@/components/ProfileEditSheet';
import { ProfileOptionList } from '@/components/ProfileOptionList';
import { ProfileSlider } from '@/components/ProfileSlider';
import { CitySearchInput } from '@/components/CitySearchInput';
import { ChildrenManager } from '@/components/ChildrenManager';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { calculateProfileCompletion } from '@/lib/utils/profileCompletion';
import { useCurrentUserProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Child {
  id: string;
  birthdate: string;
  gender: string;
  custody: number;
}

// Helper function to get degree label from value
const getDegreeLabel = (value: string): string => {
  const degreeMap: Record<string, string> = {
    'high-school': 'High School',
    'associate': 'Associate Degree',
    'bachelor': 'Bachelor\'s Degree',
    'master': 'Master\'s Degree',
    'phd': 'PhD / Doctorate',
    'professional': 'Professional Degree',
    'other': 'Other',
  };
  return degreeMap[value] || value;
};

const defaultProfile = {
  email: 'user@example.com',
  phone: '',
  verified: false,
  memberSince: '2024',
  displayName: '',
  gender: 'woman', // Set during onboarding
  birthYear: 1990,
  city: '',
  country: '',
  hometown: '',
  hometownCountry: '',
  languages: [] as string[],
  photo: '',
  sexuality: '',
  ethnicity: '',
  religion: '',
  degree: '',
  fieldOfStudy: '',
  school: '',
  profession: '',
  bio: '',
  children: [] as Child[],
  starSign: '',
  politics: '',
  height: 0,
  weight: 0,
  exercise: '',
  drinking: '',
  smoking: '',
  cannabis: '',
  drugs: '',
  diet: '',
  vaccinated: '',
  eyeColour: '',
  hairColour: '',
  pets: '',
  bloodType: '',
  interests: [] as string[],
  causes: [] as string[],
  qualities: [] as string[],
  involvement: 50,
  preferredMethod: 'open',
  openToRelocation: false,
  relationshipStatus: 'single',
  lookingFor: [] as string[],
  householdSituation: '',
  familySituation: '',
  custodySchoolArrangement: 'flexible',
  custodySchoolDays: '',
  custodyVacationArrangement: 'flexible',
  custodyVacationConditions: '',
  custodyFurtherInfo: '',
  conceptionMethods: [] as string[],
  parentingPhilosophy: '',
  financialSituation: '',
  lifestyleRhythm: '',
};

const sexualityOptions = [
  { value: 'heterosexual', label: 'Straight' },
  { value: 'homosexual', label: 'Gay/Lesbian' },
  { value: 'bisexual', label: 'Bisexual' },
  { value: 'pansexual', label: 'Pansexual' },
  { value: 'asexual', label: 'Asexual' },
  { value: 'other', label: 'Other' },
];

const exerciseOptions = [
  { value: 'active', label: 'Active', description: 'I work out regularly' },
  { value: 'sometimes', label: 'Sometimes', description: 'A few times a month' },
  { value: 'rarely', label: 'Almost never', description: 'Exercise isn\'t my thing' },
];

const drinkingOptions = [
  { value: 'never', label: 'Never', description: 'I don\'t drink alcohol' },
  { value: 'sometimes', label: 'Sometimes', description: 'On special occasions' },
  { value: 'often', label: 'Frequently', description: 'Most weekends' },
  { value: 'socially', label: 'Socially', description: 'When I\'m with friends' },
];

const smokingOptions = [
  { value: 'never', label: 'No', description: 'I don\'t smoke' },
  { value: 'sometimes', label: 'Sometimes', description: 'Occasionally' },
  { value: 'socially', label: 'Socially', description: 'When socialising' },
  { value: 'regularly', label: 'Yes', description: 'I smoke regularly' },
];

const cannabisOptions = [
  { value: 'never', label: 'Never', description: 'Not for me' },
  { value: 'sometimes', label: 'Sometimes', description: 'Occasionally' },
  { value: 'often', label: 'Frequently', description: 'Regular user' },
];

const drugsOptions = [
  { value: 'never', label: 'Never', description: 'Not for me' },
  { value: 'sometimes', label: 'Sometimes', description: 'Occasionally' },
  { value: 'often', label: 'Frequently', description: 'Regular user' },
];

const dietOptions = [
  { value: 'omnivore', label: 'Omnivore', description: 'I eat everything' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat' },
  { value: 'vegan', label: 'Vegan', description: 'No animal products' },
  { value: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat' },
  { value: 'flexitarian', label: 'Flexitarian', description: 'Mostly plant-based' },
  { value: 'keto', label: 'Keto', description: 'Low-carb, high-fat' },
  { value: 'halal', label: 'Halal', description: 'Islamic dietary guidelines' },
  { value: 'kosher', label: 'Kosher', description: 'Jewish dietary guidelines' },
];

const vaccinatedOptions = [
  { value: 'yes', label: 'Yes', description: 'Fully vaccinated' },
  { value: 'partially', label: 'Partially', description: 'Some vaccinations' },
  { value: 'no', label: 'No', description: 'Not vaccinated' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

const religionOptions = [
  { value: 'agnostic', label: 'Agnostic' },
  { value: 'atheist', label: 'Atheist' },
  { value: 'buddhist', label: 'Buddhist' },
  { value: 'christian', label: 'Christian' },
  { value: 'hindu', label: 'Hindu' },
  { value: 'jewish', label: 'Jewish' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'other', label: 'Other' },
];

const politicsOptions = [
  { value: 'liberal', label: 'Liberal' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'conservative', label: 'Conservative' },
  { value: 'apolitical', label: 'Not political' },
  { value: 'other', label: 'Other' },
];

const starSignOptions = [
  { value: 'aries', label: 'Aries' },
  { value: 'taurus', label: 'Taurus' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'cancer', label: 'Cancer' },
  { value: 'leo', label: 'Leo' },
  { value: 'virgo', label: 'Virgo' },
  { value: 'libra', label: 'Libra' },
  { value: 'scorpio', label: 'Scorpio' },
  { value: 'sagittarius', label: 'Sagittarius' },
  { value: 'capricorn', label: 'Capricorn' },
  { value: 'aquarius', label: 'Aquarius' },
  { value: 'pisces', label: 'Pisces' },
];

const ethnicityOptions = [
  { value: 'asian', label: 'Asian' },
  { value: 'black', label: 'Black' },
  { value: 'caucasian', label: 'White/Caucasian' },
  { value: 'hispanic', label: 'Hispanic/Latino' },
  { value: 'middle-eastern', label: 'Middle Eastern' },
  { value: 'mixed', label: 'Mixed' },
  { value: 'south-asian', label: 'South Asian' },
  { value: 'other', label: 'Other' },
];

const petOptions = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'fish', label: 'Fish' },
  { value: 'bird', label: 'Bird' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'No pets' },
  { value: 'allergic', label: 'Allergic' },
];

const eyeColourOptions = [
  { value: 'brown', label: 'Brown' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'hazel', label: 'Hazel' },
  { value: 'grey', label: 'Grey' },
];

const hairColourOptions = [
  { value: 'black', label: 'Black' },
  { value: 'brown', label: 'Brown' },
  { value: 'blonde', label: 'Blonde' },
  { value: 'red', label: 'Red' },
  { value: 'grey', label: 'Grey' },
];

const bloodTypeOptions = [
  { value: 'a-pos', label: 'A+' },
  { value: 'a-neg', label: 'A-' },
  { value: 'b-pos', label: 'B+' },
  { value: 'b-neg', label: 'B-' },
  { value: 'ab-pos', label: 'AB+' },
  { value: 'ab-neg', label: 'AB-' },
  { value: 'o-pos', label: 'O+' },
  { value: 'o-neg', label: 'O-' },
];

const interestOptions = [
  '🎵 Music', '📚 Reading', '🎮 Gaming', '✈️ Travel', '🎬 Movies',
  '🍳 Cooking', '🏃 Running', '🧘 Yoga', '📷 Photography', '🎨 Art',
  '🌱 Gardening', '🎭 Theatre', '⚽ Sports', '💃 Dancing', '🍷 Wine',
];

const causesOptions = [
  'Environmentalism', 'Feminism', 'LGBTQ+ Rights', 'Animal Rights',
  'Mental Health', 'Racial Equality', 'Education', 'Climate Action',
];

const qualitiesOptions = [
  'Ambition', 'Empathy', 'Curiosity', 'Kindness', 'Honesty',
  'Humor', 'Intelligence', 'Creativity', 'Patience', 'Loyalty',
];

const conceptionMethodOptions = [
  { value: 'natural', label: 'Natural conception', description: 'Traditional method' },
  { value: 'home-insemination', label: 'Home insemination', description: 'At-home method' },
  { value: 'assisted', label: 'Assisted reproduction', description: 'IVF, IUI, etc.' },
];

const relationshipOptions = [
  { value: 'single', label: 'Single' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'separated', label: 'Separated' },
  { value: 'partnered', label: 'In a relationship' },
];

const householdSituationOptions = [
  { value: 'living-alone', label: 'Living alone' },
  { value: 'living-with-partner', label: 'Living with partner' },
  { value: 'living-with-family', label: 'Living with family' },
  { value: 'shared-housing', label: 'Shared housing' },
  { value: 'single-parent', label: 'Single parent household' },
];

const familySituationOptions = [
  { value: 'close-nearby', label: 'Close relationship, live nearby', description: 'Regular contact with family' },
  { value: 'close-far', label: 'Close relationship, live far away', description: 'Close but distance separates' },
  { value: 'distant-nearby', label: 'Distant relationship, live nearby', description: 'Limited contact despite proximity' },
  { value: 'distant-far', label: 'Distant relationship, live far away', description: 'Limited contact and far away' },
  { value: 'estranged', label: 'Estranged from family', description: 'No contact with family' },
  { value: 'mixed', label: 'Mixed relationships', description: 'Varies between family members' },
];

const custodySchoolArrangementOptions = [
  { value: 'flexible', label: 'Flexible arrangement', description: 'Open to discussion' },
  { value: 'specific', label: 'Specific days', description: 'Define specific days' },
];

const custodyVacationArrangementOptions = [
  { value: 'flexible', label: 'Flexible arrangement', description: 'Open to discussion' },
  { value: 'specific', label: 'Specific conditions', description: 'Define specific conditions' },
];

const lookingForOptionsWoman = [
  { value: 'classic-relationship', label: 'Classic relationship', description: 'Looking for a romantic partner' },
  { value: 'joint-custody', label: 'Joint custody', description: 'Co-parenting with shared responsibilities' },
  { value: 'sperm-donation', label: 'Sperm donation', description: 'Looking for a sperm donor' },
];

const lookingForOptionsMan = [
  { value: 'classic-relationship', label: 'Classic relationship', description: 'Looking for a romantic partner' },
  { value: 'joint-custody', label: 'Joint custody', description: 'Co-parenting with shared responsibilities' },
  { value: 'sperm-donation', label: 'Sperm donation', description: 'Open to being a sperm donor' },
];

type EditField = 
  | 'bio' | 'sexuality' | 'work' | 'education' | 'location' | 'hometown'
  | 'height' | 'weight' | 'exercise' | 'drinking' | 'smoking' | 'cannabis' | 'drugs' | 'diet' | 'vaccinated'
  | 'children' | 'starSign' | 'politics' | 'religion'
  | 'languages' | 'ethnicity' | 'pets' | 'eyeColour' | 'hairColour' | 'bloodType'
  | 'interests' | 'causes' | 'qualities'
  | 'involvement' | 'method' | 'relationship' | 'relocation' | 'lookingFor'
  | 'householdSituation' | 'familySituation' | 'custodyModel'
  | 'parentingPhilosophy' | 'financialSituation' | 'lifestyleRhythm'
  | null;

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { userRole } = useApp();
  const { t } = useLanguage();
  const { data: dbProfile, isLoading: isLoadingProfile } = useCurrentUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();
  const [profile, setProfile] = useState(defaultProfile);
  const [editField, setEditField] = useState<EditField>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate completion using dbProfile directly for consistency with Profile page
  const completionPercent = dbProfile ? calculateProfileCompletion(dbProfile) : 0;

  // Load profile from database
  useEffect(() => {
    if (!isLoadingProfile) {
      if (dbProfile && !isInitialized) {
        setProfile({
          email: dbProfile.email || '',
          phone: dbProfile.phone || '',
          verified: dbProfile.verified || false,
          memberSince: dbProfile.created_at ? new Date(dbProfile.created_at).getFullYear().toString() : '2024',
          displayName: dbProfile.full_name || dbProfile.first_name || dbProfile.display_name || '',
          gender: dbProfile.gender || 'woman',
          birthYear: dbProfile.birth_date ? new Date(dbProfile.birth_date).getFullYear() : 1990,
          city: dbProfile.city || '',
          country: dbProfile.country || '',
          hometown: dbProfile.hometown || '',
          hometownCountry: dbProfile.hometown_country || '',
          languages: dbProfile.languages || [],
          photo: dbProfile.photo_url || '',
          sexuality: dbProfile.sexuality || '',
          ethnicity: dbProfile.ethnicity || '',
          religion: dbProfile.religion || '',
          degree: dbProfile.degree || dbProfile.studies || '', // Fallback to studies for backward compatibility
          fieldOfStudy: dbProfile.field_of_study || '',
          school: dbProfile.school || '',
          profession: dbProfile.profession || '',
          bio: dbProfile.bio || '',
          children: [], // TODO: Load from profile_children table
          starSign: dbProfile.star_sign || '',
          politics: dbProfile.politics || '',
          height: dbProfile.height || 0,
          weight: dbProfile.weight || 0,
          exercise: dbProfile.exercise || '',
          drinking: dbProfile.drinking || '',
          smoking: dbProfile.smoking || '',
          cannabis: dbProfile.cannabis || '',
          drugs: dbProfile.drugs || '',
          diet: dbProfile.diet || '',
          vaccinated: dbProfile.vaccinated || '',
          eyeColour: dbProfile.eye_colour || '',
          hairColour: dbProfile.hair_colour || '',
          pets: dbProfile.pets || '',
          bloodType: dbProfile.blood_type || '',
          interests: dbProfile.interests || [],
          causes: dbProfile.causes || [],
          qualities: dbProfile.qualities || [],
          involvement: dbProfile.involvement_percent ?? 50, // Use 50 only if null/undefined, not if 0
          preferredMethod: 'open', // Removed from DB
          openToRelocation: false, // TODO: Add to DB if needed
          relationshipStatus: dbProfile.relationship_status || 'single',
          lookingFor: dbProfile.looking_for || [],
          householdSituation: dbProfile.household_situation || '',
          familySituation: dbProfile.family_situation || '',
          custodySchoolArrangement: 'flexible', // TODO: Load from DB
          custodySchoolDays: '',
          custodyVacationArrangement: 'flexible', // TODO: Load from DB
          custodyVacationConditions: '',
          custodyFurtherInfo: '',
          conceptionMethods: [], // TODO: Load from DB
          parentingPhilosophy: dbProfile.parenting_philosophy || '',
          financialSituation: dbProfile.financial_situation || '',
          lifestyleRhythm: dbProfile.lifestyle_rhythm || '',
        });
        setIsInitialized(true);
      } else if (!dbProfile && !isLoadingProfile) {
        // Profile doesn't exist - redirect to onboarding
        // Only show error if we're sure it doesn't exist (after loading completes)
        toast({
          title: 'Profile not found',
          description: 'Please complete onboarding first.',
          variant: 'destructive'
        });
        navigate('/onboarding');
      }
    }
  }, [dbProfile, isLoadingProfile, isInitialized, navigate, toast]);

  // Debounce timer for database updates
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateProfile = <K extends keyof typeof defaultProfile>(
    key: K,
    value: typeof defaultProfile[K]
  ) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    
    // Map local profile keys to database field names
    const dbFieldMap: Record<string, string> = {
      displayName: 'first_name', // Map to first_name (primary field)
      fullName: 'first_name', // Map to first_name (deprecated field)
      birthYear: 'birth_date', // Store as birth_date, calculate year from it
      hometownCountry: 'hometown_country',
      starSign: 'star_sign',
      eyeColour: 'eye_colour',
      hairColour: 'hair_colour',
      bloodType: 'blood_type',
      relationshipStatus: 'relationship_status',
      householdSituation: 'household_situation',
      familySituation: 'family_situation',
      parentingPhilosophy: 'parenting_philosophy',
      financialSituation: 'financial_situation',
      lifestyleRhythm: 'lifestyle_rhythm',
      involvement: 'involvement_percent',
      photo: 'photo_url',
      fieldOfStudy: 'field_of_study',
      degree: 'degree',
    };
    
    const dbKey = dbFieldMap[key as string] || key;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Save to database (debounced - wait 500ms after last change)
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        let updateData: any = {};
        
        // Handle special cases first
        if (key === 'displayName') {
          updateData.first_name = value; // Update first_name (primary field)
        } else if (key === 'birthYear') {
          // Convert birthYear to birth_date (YYYY-MM-DD format, using Jan 1st)
          const year = value as number;
          updateData.birth_date = `${year}-01-01`;
        } else {
          // Use mapped database field name
          updateData[dbKey] = value;
        }
        
        await updateProfileMutation.mutateAsync(updateData);
      } catch (error: any) {
        toast({
          title: 'Failed to save',
          description: error.message || 'Could not update profile',
          variant: 'destructive'
        });
      }
    }, 500);
  };

  const getLabel = (options: { value: string; label: string }[], value: string) => {
    return options.find(o => o.value === value)?.label || '';
  };

  const currentYear = new Date().getFullYear();
  const age = currentYear - profile.birthYear;

  const getChildrenSummary = () => {
    if (profile.children.length === 0) return '';
    return `${profile.children.length} ${profile.children.length === 1 ? t.child : t.children}`;
  };

  const getCustodyModelSummary = () => {
    const parts: string[] = [];
    const schoolLabel = getLabel(custodySchoolArrangementOptions, profile.custodySchoolArrangement);
    if (schoolLabel) {
      parts.push(`School: ${schoolLabel}${profile.custodySchoolArrangement === 'specific' && profile.custodySchoolDays ? ` (${profile.custodySchoolDays})` : ''}`);
    }
    const vacationLabel = getLabel(custodyVacationArrangementOptions, profile.custodyVacationArrangement);
    if (vacationLabel) {
      parts.push(`Vacation: ${vacationLabel}`);
    }
    if (parts.length === 0) return '';
    return parts.join(' | ');
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Upload photo
      const photoUrl = await uploadPhoto(file, session.user.id);
      
      // Update profile with new photo URL
      await updateProfileMutation.mutateAsync({ photo_url: photoUrl } as any);
      
      // Update local state
      setProfile(prev => ({ ...prev, photo: photoUrl }));
      
      toast({
        title: 'Photo uploaded',
        description: 'Your profile photo has been updated.'
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Could not upload photo. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone. You will be logged out and all your data will be permanently deleted.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Delete profile (this will cascade delete related data)
      // Set is_public and is_active to false first to hide it immediately
      const { error: hideError } = await supabase
        .from('profiles')
        .update({ is_public: false, is_active: false })
        .eq('user_id', session.user.id);

      if (hideError) throw hideError;

      // Then delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', session.user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Profile deleted',
        description: 'Your profile has been permanently deleted.'
      });

      // Sign out and redirect to landing page
      await supabase.auth.signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state while fetching profile
  if (isLoadingProfile || (!isInitialized && !dbProfile)) {
    return (
      <div className="pb-24 md:pb-8 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Don't render if no profile found (will redirect in useEffect)
  if (!dbProfile) {
    return null;
  }

  return (
    <div className="pb-24 md:pb-8 bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">{t.editProfile}</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Desktop/Tablet Header */}
      <div className="hidden md:block p-8 border-b border-border bg-card">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{t.backToProfile}</span>
          </button>
          <h1 className="text-3xl font-bold">{t.editProfile}</h1>
          <p className="text-muted-foreground mt-1">{t.updatePersonalInfo}</p>
        </div>
      </div>

      {/* Desktop/Tablet Content */}
      <div className="hidden md:block p-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Photo & Completion */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="Profile"
                        className="w-32 h-32 rounded-2xl object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-muted flex items-center justify-center border-2 border-border">
                        <User className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="absolute -bottom-2 -right-2 p-3 bg-primary rounded-full text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploadingPhoto ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{completionPercent}% {t.complete}</span>
                    </div>
                    <Progress value={completionPercent} className="h-2" />
                    <button
                      onClick={() => navigate('/profile/completion-wizard')}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t.completeProfileForBetterMatches}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-3">{t.bio}</h3>
                <button
                  onClick={() => setEditField('bio')}
                  className="w-full p-4 rounded-xl border border-border/50 bg-secondary/30 text-left hover:bg-secondary/50 transition-colors"
                >
                  <p className={profile.bio ? 'text-foreground' : 'text-muted-foreground/60'}>
                    {profile.bio || t.tellPeopleAboutYourself}
                  </p>
                </button>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">{t.aboutYou}</h3>
                <div className="space-y-1">
                  <ProfileRow icon={Briefcase} label={t.work} value={profile.profession} onClick={() => setEditField('work')} />
                  <ProfileRow icon={GraduationCap} label={t.education} value={profile.degree && profile.fieldOfStudy && profile.school ? `${getDegreeLabel(profile.degree)} in ${profile.fieldOfStudy} at ${profile.school}` : profile.degree && profile.fieldOfStudy ? `${getDegreeLabel(profile.degree)} in ${profile.fieldOfStudy}` : profile.degree ? getDegreeLabel(profile.degree) : profile.fieldOfStudy || profile.school} onClick={() => setEditField('education')} />
                  <ProfileRow icon={MapPin} label={t.location} value={profile.city && profile.country ? `${profile.city}, ${profile.country}` : ''} onClick={() => setEditField('location')} />
                  <ProfileRow icon={Home} label={t.hometown} value={profile.hometown && profile.hometownCountry ? `${profile.hometown}, ${profile.hometownCountry}` : profile.hometown} onClick={() => setEditField('hometown')} />
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">{t.spokenLanguages}</h3>
                <ProfileChipCard
                  chips={profile.languages}
                  onClick={() => setEditField('languages')}
                  emptyText={t.addLanguagesYouSpeak}
                />
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">{t.interests}</h3>
                <ProfileChipCard
                  chips={profile.interests}
                  onClick={() => setEditField('interests')}
                  emptyText={t.addYourInterests}
                />
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">{t.causesAndCommunities}</h3>
                <ProfileChipCard
                  chips={profile.causes}
                  onClick={() => setEditField('causes')}
                  emptyText={t.addCausesYouCareAbout}
                />
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">{t.coreValues}</h3>
                <ProfileChipCard
                  chips={profile.qualities}
                  onClick={() => setEditField('qualities')}
                  emptyText={t.addValuesYouCareAbout}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">{t.moreAboutYou}</h3>
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  <ProfileRow icon={Ruler} label={t.height} value={profile.height ? `${profile.height} cm` : ''} onClick={() => setEditField('height')} />
                  <ProfileRow icon={Scale} label={t.weight} value={profile.weight ? `${profile.weight} kg` : ''} onClick={() => setEditField('weight')} />
                  <ProfileRow icon={Dumbbell} label={t.exercise} value={getLabel(exerciseOptions, profile.exercise)} onClick={() => setEditField('exercise')} />
                  <ProfileRow icon={Wine} label={t.drinking} value={getLabel(drinkingOptions, profile.drinking)} onClick={() => setEditField('drinking')} />
                  <ProfileRow icon={Cigarette} label={t.smoking} value={getLabel(smokingOptions, profile.smoking)} onClick={() => setEditField('smoking')} />
                  <ProfileRow icon={Cannabis} label={t.cannabis} value={getLabel(cannabisOptions, profile.cannabis)} onClick={() => setEditField('cannabis')} />
                  <ProfileRow icon={Pill} label={t.drugs} value={getLabel(drugsOptions, profile.drugs)} onClick={() => setEditField('drugs')} />
                  <ProfileRow icon={Salad} label={t.diet} value={getLabel(dietOptions, profile.diet)} onClick={() => setEditField('diet')} />
                  <ProfileRow icon={Syringe} label={t.vaccinated} value={getLabel(vaccinatedOptions, profile.vaccinated)} onClick={() => setEditField('vaccinated')} />
                  <ProfileRow icon={Heart} label={t.sexuality} value={getLabel(sexualityOptions, profile.sexuality)} onClick={() => setEditField('sexuality')} />
                  <ProfileRow icon={Users} label={t.relationshipStatus} value={getLabel(relationshipOptions, profile.relationshipStatus)} onClick={() => setEditField('relationship')} />
                  <ProfileRow icon={Baby} label={t.children} value={getChildrenSummary()} onClick={() => setEditField('children')} />
                  <ProfileRow icon={Dog} label={t.pets} value={getLabel(petOptions, profile.pets)} onClick={() => setEditField('pets')} />
                  <ProfileRow icon={Smile} label={t.religion} value={getLabel(religionOptions, profile.religion)} onClick={() => setEditField('religion')} />
                  <ProfileRow icon={Landmark} label={t.politics} value={getLabel(politicsOptions, profile.politics)} onClick={() => setEditField('politics')} />
                  <ProfileRow icon={Star} label={t.starSign} value={getLabel(starSignOptions, profile.starSign)} onClick={() => setEditField('starSign')} />
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/50">
                <h3 className="font-semibold mb-4">{t.coParentingPreferences}</h3>
                <div className="space-y-1">
                  <ProfileRow 
                    icon={Heart} 
                    label={profile.gender === 'man' ? t.openTo : t.lookingFor} 
                    value={profile.lookingFor.map(v => {
                      const options = profile.gender === 'man' ? lookingForOptionsMan : lookingForOptionsWoman;
                      return getLabel(options, v);
                    }).join(', ')} 
                    onClick={() => setEditField('lookingFor')} 
                  />
                  <ProfileRow 
                    icon={Users} 
                    label={t.custodyPreference} 
                    value={`${profile.involvement}%`} 
                    onClick={() => setEditField('involvement')} 
                  />
                  <ProfileRow 
                    icon={Baby} 
                    label={t.conceptionMethod} 
                    value={profile.conceptionMethods.map(v => getLabel(conceptionMethodOptions, v)).join(', ')} 
                    onClick={() => setEditField('method')} 
                  />
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm">{t.openToRelocation}</span>
                    </div>
                    <Switch
                      checked={profile.openToRelocation}
                      onCheckedChange={(checked) => updateProfile('openToRelocation', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Delete Profile Section */}
              <div className="bg-card rounded-2xl p-6 border border-destructive/50">
                <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your profile and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteProfile}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden p-4 space-y-8">
        {/* Photo Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-border"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center border-2 border-border">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-full text-primary-foreground shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingPhoto ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{completionPercent}% {t.complete}</span>
            </div>
            <Progress value={completionPercent} className="h-2" />
            <button
              onClick={() => navigate('/profile/completion-wizard')}
              className="text-xs text-muted-foreground hover:text-primary transition-colors text-left"
            >
              {t.completeProfileForBetterMatches}
            </button>
          </div>
        </div>

        {/* Bio Section */}
        <ProfileSection title={t.bio}>
          <button
            onClick={() => setEditField('bio')}
            className="w-full p-4 rounded-xl border border-border/50 bg-card text-left hover:bg-secondary/30 transition-colors"
          >
            <p className={profile.bio ? 'text-foreground' : 'text-muted-foreground/60'}>
              {profile.bio || t.tellPeopleAboutYourself}
            </p>
          </button>
        </ProfileSection>

        {/* About You Section */}
        <ProfileSection title={t.aboutYou}>
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4">
              <ProfileRow icon={Briefcase} label={t.work} value={profile.profession} onClick={() => setEditField('work')} />
              <ProfileRow icon={GraduationCap} label={t.education} value={profile.studies && profile.school ? `${profile.studies} at ${profile.school}` : profile.studies} onClick={() => setEditField('education')} />
              <ProfileRow icon={MapPin} label={t.location} value={profile.city && profile.country ? `${profile.city}, ${profile.country}` : ''} onClick={() => setEditField('location')} />
              <ProfileRow icon={Home} label={t.hometown} value={profile.hometown && profile.hometownCountry ? `${profile.hometown}, ${profile.hometownCountry}` : profile.hometown} onClick={() => setEditField('hometown')} />
            </div>
          </div>
        </ProfileSection>

        {/* Characteristics Section */}
        <ProfileSection title="Characteristics">
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4">
              <ProfileRow icon={Ruler} label={t.height} value={profile.height ? `${profile.height} cm` : ''} onClick={() => setEditField('height')} />
              <ProfileRow icon={Scale} label={t.weight} value={profile.weight ? `${profile.weight} kg` : ''} onClick={() => setEditField('weight')} />
              <ProfileRow icon={Dumbbell} label={t.exercise} value={getLabel(exerciseOptions, profile.exercise)} onClick={() => setEditField('exercise')} />
              <ProfileRow icon={Wine} label={t.drinking} value={getLabel(drinkingOptions, profile.drinking)} onClick={() => setEditField('drinking')} />
              <ProfileRow icon={Cigarette} label={t.smoking} value={getLabel(smokingOptions, profile.smoking)} onClick={() => setEditField('smoking')} />
              <ProfileRow icon={Cannabis} label={t.cannabis} value={getLabel(cannabisOptions, profile.cannabis)} onClick={() => setEditField('cannabis')} />
              <ProfileRow icon={Pill} label={t.drugs} value={getLabel(drugsOptions, profile.drugs)} onClick={() => setEditField('drugs')} />
              <ProfileRow icon={Salad} label={t.diet} value={getLabel(dietOptions, profile.diet)} onClick={() => setEditField('diet')} />
              <ProfileRow icon={Syringe} label={t.vaccinated} value={getLabel(vaccinatedOptions, profile.vaccinated)} onClick={() => setEditField('vaccinated')} />
              <ProfileRow icon={Droplet} label={t.bloodType} value={getLabel(bloodTypeOptions, profile.bloodType)} onClick={() => setEditField('bloodType')} />
              <ProfileRow icon={Eye} label={t.eyeColour} value={getLabel(eyeColourOptions, profile.eyeColour)} onClick={() => setEditField('eyeColour')} />
              <ProfileRow icon={Palette} label={t.hairColour} value={getLabel(hairColourOptions, profile.hairColour)} onClick={() => setEditField('hairColour')} />
              <ProfileRow icon={Globe} label={t.ethnicity} value={getLabel(ethnicityOptions, profile.ethnicity)} onClick={() => setEditField('ethnicity')} />
              <ProfileRow icon={Heart} label={t.sexuality} value={getLabel(sexualityOptions, profile.sexuality)} onClick={() => setEditField('sexuality')} />
              <ProfileRow icon={Users} label={t.relationshipStatus} value={getLabel(relationshipOptions, profile.relationshipStatus)} onClick={() => setEditField('relationship')} />
              <ProfileRow icon={Home} label={t.householdSituation} value={getLabel(householdSituationOptions, profile.householdSituation)} onClick={() => setEditField('householdSituation')} />
              <ProfileRow icon={Users} label={t.familySituation} value={getLabel(familySituationOptions, profile.familySituation)} onClick={() => setEditField('familySituation')} />
              <ProfileRow icon={Baby} label={t.children} value={getChildrenSummary()} onClick={() => setEditField('children')} />
              <ProfileRow icon={Dog} label={t.pets} value={getLabel(petOptions, profile.pets)} onClick={() => setEditField('pets')} />
              <ProfileRow icon={Smile} label={t.religion} value={getLabel(religionOptions, profile.religion)} onClick={() => setEditField('religion')} />
              <ProfileRow icon={Landmark} label={t.politics} value={getLabel(politicsOptions, profile.politics)} onClick={() => setEditField('politics')} />
              <ProfileRow icon={Star} label={t.starSign} value={getLabel(starSignOptions, profile.starSign)} onClick={() => setEditField('starSign')} />
            </div>
          </div>
        </ProfileSection>

        {/* Languages */}
        <ProfileSection title={t.spokenLanguages}>
          <ProfileChipCard
            chips={profile.languages}
            onClick={() => setEditField('languages')}
            emptyText={t.addLanguagesYouSpeak}
          />
        </ProfileSection>

        {/* Interests Section */}
        <ProfileSection title={t.interests}>
          <ProfileChipCard
            chips={profile.interests}
            onClick={() => setEditField('interests')}
            emptyText={t.addYourInterests}
          />
        </ProfileSection>

        {/* Causes & Communities */}
        <ProfileSection title={t.causesAndCommunities}>
          <ProfileChipCard
            chips={profile.causes}
            onClick={() => setEditField('causes')}
            emptyText={t.addCausesYouCareAbout}
          />
        </ProfileSection>

        {/* Core values */}
        <ProfileSection title={t.coreValues}>
          <ProfileChipCard
            chips={profile.qualities}
            onClick={() => setEditField('qualities')}
            emptyText={t.addValuesYouCareAbout}
          />
        </ProfileSection>

        {/* Co-Parenting Preferences */}
        <ProfileSection title={t.coParentingPreferences}>
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4">
              <ProfileRow 
                icon={Heart} 
                label={profile.gender === 'man' ? t.openTo : t.lookingFor} 
                value={profile.lookingFor.map(v => {
                  const options = profile.gender === 'man' ? lookingForOptionsMan : lookingForOptionsWoman;
                  return getLabel(options, v);
                }).join(', ')} 
                onClick={() => setEditField('lookingFor')} 
              />
              <ProfileRow 
                icon={Users} 
                label={t.custodyPreference} 
                value={`${profile.involvement}%`} 
                onClick={() => setEditField('involvement')} 
              />
              <ProfileRow 
                icon={Home} 
                label={t.custodyModel} 
                value={getCustodyModelSummary()} 
                onClick={() => setEditField('custodyModel')} 
              />
              <ProfileRow 
                icon={Baby} 
                label={t.conceptionMethod} 
                value={(profile.conceptionMethods || []).map(v => getLabel(conceptionMethodOptions, v)).join(', ')} 
                onClick={() => setEditField('method')} 
              />
              <ProfileRow 
                icon={MapPin} 
                label={t.openToRelocation} 
                value={profile.openToRelocation ? t.yes : t.no} 
                onClick={() => setEditField('relocation')} 
              />
            </div>
          </div>
        </ProfileSection>

        {/* Parenting Philosophy */}
        <ProfileSection title={t.parentingPhilosophy}>
          <button
            onClick={() => setEditField('parentingPhilosophy')}
            className="w-full p-4 rounded-xl border border-border/50 bg-card text-left hover:bg-secondary/30 transition-colors"
          >
            <p className={profile.parentingPhilosophy ? 'text-foreground' : 'text-muted-foreground/60'}>
              {profile.parentingPhilosophy || t.describeYourApproach}
            </p>
          </button>
        </ProfileSection>

        {/* Financial Situation */}
        <ProfileSection title={t.financialSituation}>
          <button
            onClick={() => setEditField('financialSituation')}
            className="w-full p-4 rounded-xl border border-border/50 bg-card text-left hover:bg-secondary/30 transition-colors"
          >
            <p className={profile.financialSituation ? 'text-foreground' : 'text-muted-foreground/60'}>
              {profile.financialSituation || t.describeFinancialSituation}
            </p>
          </button>
        </ProfileSection>

        {/* Lifestyle Rhythm */}
        <ProfileSection title={t.lifestyleRhythm}>
          <button
            onClick={() => setEditField('lifestyleRhythm')}
            className="w-full p-4 rounded-xl border border-border/50 bg-card text-left hover:bg-secondary/30 transition-colors"
          >
            <p className={profile.lifestyleRhythm ? 'text-foreground' : 'text-muted-foreground/60'}>
              {profile.lifestyleRhythm || t.describeDailyRhythm}
            </p>
          </button>
        </ProfileSection>
      </div>

      {/* Edit Sheets */}
      <ProfileEditSheet open={editField === 'bio'} onOpenChange={(o) => !o && setEditField(null)} title={t.bio}>
        <textarea
          value={profile.bio}
          onChange={(e) => updateProfile('bio', e.target.value)}
          placeholder={t.tellPeopleAboutYourself}
          className="w-full min-h-[200px] p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-2 text-right">{profile.bio.length}/500</p>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'sexuality'} onOpenChange={(o) => !o && setEditField(null)} title={t.sexuality} subtitle={t.sexualOrientation}>
        <ProfileOptionList options={sexualityOptions} value={profile.sexuality} onChange={(v) => updateProfile('sexuality', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'work'} onOpenChange={(o) => !o && setEditField(null)} title={t.work}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.work}</label>
            <input
              type="text"
              value={profile.profession}
              onChange={(e) => updateProfile('profession', e.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'education'} onOpenChange={(o) => !o && setEditField(null)} title={t.education}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Degree</label>
            <ProfileOptionList
              options={[
                { value: 'high-school', label: 'High School' },
                { value: 'associate', label: 'Associate Degree' },
                { value: 'bachelor', label: 'Bachelor\'s Degree' },
                { value: 'master', label: 'Master\'s Degree' },
                { value: 'phd', label: 'PhD / Doctorate' },
                { value: 'professional', label: 'Professional Degree' },
                { value: 'other', label: 'Other' },
              ]}
              value={profile.degree}
              onChange={(v) => updateProfile('degree', v as string)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Field of study</label>
            <input
              type="text"
              value={profile.fieldOfStudy}
              onChange={(e) => updateProfile('fieldOfStudy', e.target.value)}
              placeholder="e.g., Computer Science"
              className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">University or School</label>
            <input
              type="text"
              value={profile.school}
              onChange={(e) => updateProfile('school', e.target.value)}
              placeholder="e.g., University of Oxford"
              className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'location'} onOpenChange={(o) => !o && setEditField(null)} title={t.location}>
        <CitySearchInput
          value={profile.city}
          onChange={(city, country) => {
            updateProfile('city', city);
            updateProfile('country', country);
          }}
          placeholder={t.searchForCity}
        />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'hometown'} onOpenChange={(o) => !o && setEditField(null)} title={t.hometown}>
        <CitySearchInput
          value={profile.hometown}
          onChange={(city, country) => {
            updateProfile('hometown', city);
            updateProfile('hometownCountry', country);
          }}
          placeholder={t.searchForHometown}
        />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'height'} onOpenChange={(o) => !o && setEditField(null)} title={t.height} subtitle={t.howTallAreYou}>
        <ProfileSlider label={t.height} value={profile.height} onChange={(v) => updateProfile('height', v)} min={140} max={210} unit=" cm" />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'weight'} onOpenChange={(o) => !o && setEditField(null)} title={t.weight} subtitle={t.whatsYourWeight}>
        <ProfileSlider label={t.weight} value={profile.weight} onChange={(v) => updateProfile('weight', v)} min={40} max={150} unit=" kg" />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'exercise'} onOpenChange={(o) => !o && setEditField(null)} title={t.exercise} subtitle={t.howOftenWorkout} icon={Dumbbell}>
        <ProfileOptionList options={exerciseOptions} value={profile.exercise} onChange={(v) => updateProfile('exercise', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'drinking'} onOpenChange={(o) => !o && setEditField(null)} title={t.drinking} subtitle={t.doYouDrink} icon={Wine}>
        <ProfileOptionList options={drinkingOptions} value={profile.drinking} onChange={(v) => updateProfile('drinking', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'smoking'} onOpenChange={(o) => !o && setEditField(null)} title={t.smoking} subtitle={t.doYouSmoke} icon={Cigarette}>
        <ProfileOptionList options={smokingOptions} value={profile.smoking} onChange={(v) => updateProfile('smoking', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'cannabis'} onOpenChange={(o) => !o && setEditField(null)} title={t.cannabis} subtitle={t.doYouUseCannabis} icon={Cannabis}>
        <ProfileOptionList options={cannabisOptions} value={profile.cannabis} onChange={(v) => updateProfile('cannabis', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'drugs'} onOpenChange={(o) => !o && setEditField(null)} title={t.drugs} subtitle={t.doYouUseDrugs} icon={Pill}>
        <ProfileOptionList options={drugsOptions} value={profile.drugs} onChange={(v) => updateProfile('drugs', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'diet'} onOpenChange={(o) => !o && setEditField(null)} title={t.diet} subtitle={t.whatsYourDiet} icon={Salad}>
        <ProfileOptionList options={dietOptions} value={profile.diet} onChange={(v) => updateProfile('diet', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'vaccinated'} onOpenChange={(o) => !o && setEditField(null)} title={t.vaccinated} subtitle={t.vaccinationStatus} icon={Syringe}>
        <ProfileOptionList options={vaccinatedOptions} value={profile.vaccinated} onChange={(v) => updateProfile('vaccinated', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'children'} onOpenChange={(o) => !o && setEditField(null)} title={t.children} subtitle={t.addChildrenDetails}>
        <ChildrenManager 
          children={profile.children} 
          onChange={(children) => updateProfile('children', children)} 
        />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'starSign'} onOpenChange={(o) => !o && setEditField(null)} title={t.starSign} subtitle={t.zodiacSign} icon={Star}>
        <ProfileOptionList options={starSignOptions} value={profile.starSign} onChange={(v) => updateProfile('starSign', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'politics'} onOpenChange={(o) => !o && setEditField(null)} title={t.politics} subtitle={t.politicalViews} icon={Landmark}>
        <ProfileOptionList options={politicsOptions} value={profile.politics} onChange={(v) => updateProfile('politics', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'religion'} onOpenChange={(o) => !o && setEditField(null)} title={t.religion} subtitle={t.religiousBeliefs} icon={Sparkles}>
        <ProfileOptionList options={religionOptions} value={profile.religion} onChange={(v) => updateProfile('religion', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'ethnicity'} onOpenChange={(o) => !o && setEditField(null)} title={t.ethnicity} subtitle={t.ethnicBackground} icon={Globe}>
        <ProfileOptionList options={ethnicityOptions} value={profile.ethnicity} onChange={(v) => updateProfile('ethnicity', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'eyeColour'} onOpenChange={(o) => !o && setEditField(null)} title={t.eyeColour} subtitle={t.whatColourEyes} icon={Eye}>
        <ProfileOptionList options={eyeColourOptions} value={profile.eyeColour} onChange={(v) => updateProfile('eyeColour', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'hairColour'} onOpenChange={(o) => !o && setEditField(null)} title={t.hairColour} subtitle={t.whatColourHair} icon={Palette}>
        <ProfileOptionList options={hairColourOptions} value={profile.hairColour} onChange={(v) => updateProfile('hairColour', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'pets'} onOpenChange={(o) => !o && setEditField(null)} title={t.pets} subtitle={t.doYouHavePets} icon={Dog}>
        <ProfileOptionList options={petOptions} value={profile.pets} onChange={(v) => updateProfile('pets', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'bloodType'} onOpenChange={(o) => !o && setEditField(null)} title={t.bloodType} subtitle={t.whatsYourBloodType} icon={Droplet}>
        <ProfileOptionList options={bloodTypeOptions} value={profile.bloodType} onChange={(v) => updateProfile('bloodType', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'languages'} onOpenChange={(o) => !o && setEditField(null)} title={t.spokenLanguages} subtitle={t.whatLanguagesDoYouKnow} icon={MessageCircle}>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{t.languagesHelperText}</p>
          <p className="text-sm font-medium text-muted-foreground mt-2">{t.selectUpToFive}</p>
        </div>
        <ProfileOptionList 
          options={allLanguages.map(lang => ({ value: lang, label: lang }))} 
          value={profile.languages} 
          onChange={(v) => updateProfile('languages', v as string[])} 
          multiple
          maxSelections={5}
          showSearch
          searchPlaceholder="Search for a language"
          showSaveButton
          onSave={() => setEditField(null)}
        />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'interests'} onOpenChange={(o) => !o && setEditField(null)} title={t.interests} subtitle={t.selectUpToFive}>
        <p className="text-sm text-muted-foreground mb-4">{profile.interests.length}/5 {t.selected}</p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => {
                const has = profile.interests.includes(interest);
                if (has) {
                  updateProfile('interests', profile.interests.filter(i => i !== interest));
                } else if (profile.interests.length < 5) {
                  updateProfile('interests', [...profile.interests, interest]);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                profile.interests.includes(interest)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'causes'} onOpenChange={(o) => !o && setEditField(null)} title={t.causesAndCommunities} subtitle={t.selectUpToThree}>
        <p className="text-sm text-muted-foreground mb-4">{profile.causes.length}/3 {t.selected}</p>
        <div className="flex flex-wrap gap-2">
          {causesOptions.map((cause) => (
            <button
              key={cause}
              onClick={() => {
                const has = profile.causes.includes(cause);
                if (has) {
                  updateProfile('causes', profile.causes.filter(c => c !== cause));
                } else if (profile.causes.length < 3) {
                  updateProfile('causes', [...profile.causes, cause]);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                profile.causes.includes(cause)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cause}
            </button>
          ))}
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'qualities'} onOpenChange={(o) => !o && setEditField(null)} title={t.coreValues} subtitle={t.selectUpToThree}>
        <p className="text-sm text-muted-foreground mb-4">{profile.qualities.length}/3 {t.selected}</p>
        <div className="flex flex-wrap gap-2">
          {qualitiesOptions.map((quality) => (
            <button
              key={quality}
              onClick={() => {
                const has = profile.qualities.includes(quality);
                if (has) {
                  updateProfile('qualities', profile.qualities.filter(q => q !== quality));
                } else if (profile.qualities.length < 3) {
                  updateProfile('qualities', [...profile.qualities, quality]);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                profile.qualities.includes(quality)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {quality}
            </button>
          ))}
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'involvement'} onOpenChange={(o) => !o && setEditField(null)} title={t.custodyPreference} subtitle={t.howMuchTimeWithChild}>
        <ProfileSlider
          label={t.preferredInvolvement}
          value={profile.involvement}
          onChange={(v) => updateProfile('involvement', v)}
          min={0}
          max={100}
          step={5}
          unit="%"
        />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'method'} onOpenChange={(o) => !o && setEditField(null)} title={t.conceptionMethod} subtitle={t.approachesOpenTo}>
        <ProfileOptionList 
          options={conceptionMethodOptions} 
          value={profile.conceptionMethods} 
          onChange={(v) => updateProfile('conceptionMethods', v as string[])} 
          multiple
          showSaveButton
          onSave={() => setEditField(null)}
        />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'relationship'} onOpenChange={(o) => !o && setEditField(null)} title={t.relationshipStatus} subtitle={t.currentStatus} icon={Heart}>
        <ProfileOptionList options={relationshipOptions} value={profile.relationshipStatus} onChange={(v) => updateProfile('relationshipStatus', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'householdSituation'} onOpenChange={(o) => !o && setEditField(null)} title={t.householdSituation} subtitle={t.livingArrangement} icon={Home}>
        <ProfileOptionList options={householdSituationOptions} value={profile.householdSituation} onChange={(v) => updateProfile('householdSituation', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'familySituation'} onOpenChange={(o) => !o && setEditField(null)} title={t.familySituation} subtitle={t.relationshipWithFamily} icon={Users}>
        <ProfileOptionList options={familySituationOptions} value={profile.familySituation} onChange={(v) => updateProfile('familySituation', v as string)} />
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'custodyModel'} onOpenChange={(o) => !o && setEditField(null)} title={t.custodyModel} subtitle={t.custodyArrangementPrefs}>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.duringSchool}</label>
            <ProfileOptionList 
              options={custodySchoolArrangementOptions} 
              value={profile.custodySchoolArrangement} 
              onChange={(v) => updateProfile('custodySchoolArrangement', v as string)} 
            />
            {profile.custodySchoolArrangement === 'specific' && (
              <input
                type="text"
                value={profile.custodySchoolDays}
                onChange={(e) => updateProfile('custodySchoolDays', e.target.value)}
                placeholder="e.g., Monday to Wednesday"
                className="w-full mt-3 p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.duringVacation}</label>
            <ProfileOptionList 
              options={custodyVacationArrangementOptions} 
              value={profile.custodyVacationArrangement} 
              onChange={(v) => updateProfile('custodyVacationArrangement', v as string)} 
            />
            {profile.custodyVacationArrangement === 'specific' && (
              <textarea
                value={profile.custodyVacationConditions}
                onChange={(e) => updateProfile('custodyVacationConditions', e.target.value)}
                className="w-full mt-3 p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">{t.furtherInfo}</label>
            <textarea
              value={profile.custodyFurtherInfo}
              onChange={(e) => updateProfile('custodyFurtherInfo', e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'parentingPhilosophy'} onOpenChange={(o) => !o && setEditField(null)} title={t.parentingPhilosophy}>
        <textarea
          value={profile.parentingPhilosophy}
          onChange={(e) => updateProfile('parentingPhilosophy', e.target.value)}
          placeholder={t.describeParentingPhilosophy}
          className="w-full min-h-[200px] p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-2 text-right">{profile.parentingPhilosophy.length}/500</p>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'financialSituation'} onOpenChange={(o) => !o && setEditField(null)} title={t.financialSituation}>
        <textarea
          value={profile.financialSituation}
          onChange={(e) => updateProfile('financialSituation', e.target.value)}
          placeholder={t.describeFinancialApproach}
          className="w-full min-h-[200px] p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-2 text-right">{profile.financialSituation.length}/500</p>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'lifestyleRhythm'} onOpenChange={(o) => !o && setEditField(null)} title={t.lifestyleRhythm}>
        <textarea
          value={profile.lifestyleRhythm}
          onChange={(e) => updateProfile('lifestyleRhythm', e.target.value)}
          placeholder={t.describeRoutine}
          className="w-full min-h-[200px] p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-2 text-right">{profile.lifestyleRhythm.length}/500</p>
      </ProfileEditSheet>

      <ProfileEditSheet open={editField === 'relocation'} onOpenChange={(o) => !o && setEditField(null)} title={t.openToRelocation}>
        <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
          <div>
            <p className="font-medium">{t.openToRelocation}</p>
          </div>
          <Switch checked={profile.openToRelocation} onCheckedChange={(v) => updateProfile('openToRelocation', v)} />
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet 
        open={editField === 'lookingFor'} 
        onOpenChange={(o) => !o && setEditField(null)} 
        title={profile.gender === 'man' ? t.openTo : t.lookingFor} 
        icon={Heart}
      >
        <ProfileOptionList 
          options={profile.gender === 'man' ? lookingForOptionsMan : lookingForOptionsWoman} 
          value={profile.lookingFor} 
          onChange={(v) => updateProfile('lookingFor', v as string[])} 
          multiple
          showSaveButton
          onSave={() => setEditField(null)}
        />
      </ProfileEditSheet>

      {/* Delete Profile Section - Mobile */}
      <div className="md:hidden p-4 bg-card rounded-2xl border border-destructive/50">
        <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your profile and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteProfile}
          disabled={isDeleting}
          className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : 'Delete Profile'}
        </button>
      </div>
    </div>
  );
}
