import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { navigateToLandingTop } from '@/lib/landingNavigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerDropdown } from '@/components/ui/date-picker-dropdown';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { User, Camera, ArrowRight, ArrowLeft, CheckCircle, Briefcase, Globe, Users, Wine, Cigarette, Heart, Sparkles, Upload, MapPin } from 'lucide-react';
import kindlyLogo from '@/assets/kindly-logo.png';
import { allLanguages, ethnicityLabels } from '@/lib/utils/candidateLabels';
import { uploadPhoto } from '@/lib/utils/photoUpload';
import { CitySearchInput } from '@/components/CitySearchInput';

const drinkingOptions = [
  { value: 'never', label: 'Never', description: 'I don\'t drink alcohol' },
  { value: 'sometimes', label: 'Sometimes', description: 'On special occasions' },
  { value: 'often', label: 'Frequently', description: 'Most weekends' },
  { value: 'socially', label: 'Socially', description: 'When I\'m with friends' },
];

const smokingOptions = [
  { value: 'never', label: 'No', description: 'I don\'t smoke' },
  { value: 'occasionally', label: 'Occasionally', description: 'Sometimes' },
  { value: 'regularly', label: 'Yes', description: 'I smoke regularly' },
  { value: 'former', label: 'Former smoker', description: 'I used to smoke' },
];

const qualitiesOptions = [
  'Ambition', 'Empathy', 'Curiosity', 'Kindness', 'Honesty',
  'Humor', 'Intelligence', 'Creativity', 'Patience', 'Loyalty',
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

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
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

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [profession, setProfession] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [ethnicity, setEthnicity] = useState('');
  const [drinking, setDrinking] = useState('');
  const [smoking, setSmoking] = useState('');
  const [bio, setBio] = useState('');
  const [qualities, setQualities] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [involvementPercent, setInvolvementPercent] = useState<number>(50);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showQualitiesSelector, setShowQualitiesSelector] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});
  const languageSelectorRef = useRef<HTMLDivElement>(null);
  const qualitiesSelectorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;

      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUserId(session.user.id);
      
      // Check if already onboarded
      supabase
        .from('profiles')
        .select('onboarding_completed, gender, birth_date, city, country, profession, languages, ethnicity, drinking, smoking, bio, qualities, looking_for, involvement_percent, photo_url, first_name')
        .eq('user_id', session.user.id)
        .maybeSingle()
        .then(async ({ data, error }) => {
          if (!isMounted) return;

          if (error) {
            console.error('Error fetching profile:', error);
          }
          
          if (data?.onboarding_completed) {
            navigate('/profile');
            return;
          }
          
          // Load existing data if available
          if (data?.gender) setGender(data.gender as 'male' | 'female');
          if (data?.birth_date) {
            setBirthDate(data.birth_date);
          }
          if (data?.city) setCity(data.city);
          if (data?.country) setCountry(data.country);
          if (data?.profession) setProfession(data.profession);
          if (data?.languages) setLanguages(data.languages);
          if (data?.ethnicity) setEthnicity(data.ethnicity);
          if (data?.drinking) setDrinking(data.drinking);
          if (data?.smoking) setSmoking(data.smoking);
          if (data?.bio) setBio(data.bio);
          if (data?.qualities && Array.isArray(data.qualities)) setQualities(data.qualities);
          if (data?.involvement_percent !== null && data?.involvement_percent !== undefined) setInvolvementPercent(data.involvement_percent);
          if (data?.photo_url) setPhotoPreview(data.photo_url);
          // Handle looking_for: ensure it's an array
          if (data?.looking_for) {
            if (Array.isArray(data.looking_for)) {
              setLookingFor(data.looking_for);
            } else if (typeof data.looking_for === 'string') {
              setLookingFor([data.looking_for]);
            }
          }
          
          setIsInitializing(false);
        })
        .catch((error) => {
          console.error('Error in profile fetch:', error);
          if (isMounted) {
            setIsInitializing(false);
          }
        });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      // If session is restored, set userId
      if (session && !userId) {
        setUserId(session.user.id);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, userId]);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target as Node)) {
        setShowLanguageSelector(false);
      }
      if (qualitiesSelectorRef.current && !qualitiesSelectorRef.current.contains(event.target as Node)) {
        setShowQualitiesSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      setPhotoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'User not found. Please try logging in again.',
        variant: 'destructive'
      });
      return;
    }
    
    // Validate step 3
    if (!validateStep(3)) {
      return;
    }
    
      // birth_date is already in YYYY-MM-DD format, no conversion needed
    
    // Final validation check
    if (!gender || !birthDate || !city || !bio.trim() || !profession.trim() || languages.length === 0 || !ethnicity || !drinking || !smoking || qualities.length !== 3 || lookingFor.length === 0) {
      toast({
        title: 'Please complete all fields',
        description: 'All fields are required.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Starting onboarding completion...', { userId, gender, birthDate, city, lookingFor });
      let photoUrl: string | null = null;
      
      // Upload photo if a new file was selected
      if (photoFile) {
        setIsUploadingPhoto(true);
        try {
          photoUrl = await uploadPhoto(photoFile, userId);
          // Clear any error state
          setStepErrors(prev => ({ ...prev, [step]: [] }));
        } catch (uploadError: any) {
          console.error('Photo upload error:', uploadError);
          // Don't show error toast if user can continue without photo
          // Just log it and continue with null photo
          photoUrl = null;
        } finally {
          setIsUploadingPhoto(false);
        }
      } else if (photoPreview && photoPreview.startsWith('http')) {
        // If photoPreview is already a URL (from existing profile), use it
        photoUrl = photoPreview;
      }
      // If photoPreview is a data URL (base64), ignore it - it's just a preview

      // Get user's first name from auth metadata or profile (set during signup)
      const { data: { user } } = await supabase.auth.getUser();
      const firstNameFromAuth = user?.user_metadata?.first_name || user?.user_metadata?.full_name || '';
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('user_id', userId)
        .maybeSingle();

      const firstName = firstNameFromAuth || userProfile?.first_name || '';

      // Check if profile exists, if not create it, otherwise update
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const profileData: any = {
        // Don't include user_id in update (it's already set)
        email: (await supabase.auth.getUser()).data.user?.email || '',
        gender: gender as 'male' | 'female',
        first_name: firstName, // Primary name field
        birth_date: birthDate, // Primary birthdate field (YYYY-MM-DD format)
        looking_for: lookingFor, // Array of looking_for options
        city: city.trim(),
        country: country.trim() || null,
        profession: profession.trim(),
        languages: languages, // Array of languages
        ethnicity: ethnicity,
        drinking: drinking,
        smoking: smoking,
        bio: bio.trim(),
        qualities: qualities, // Array of core values (exactly 3)
        involvement_percent: involvementPercent, // Custody preference percentage
        photo_url: photoUrl, // Will be null if no photo uploaded
        onboarding_completed: true,
        is_public: true, // Make profile public when onboarding completes
        is_active: true // Ensure profile is active
      };

      let error;
      if (existingProfile) {
        // Update existing profile - don't include user_id in update
        console.log('Updating existing profile:', existingProfile.id);
        console.log('Profile data to update:', profileData);
        const { data: updatedData, error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', userId)
          .select('id, first_name, birth_date, email, gender, city, country, profession, languages, ethnicity, drinking, smoking, bio, qualities, looking_for, involvement_percent, photo_url, onboarding_completed, is_public, is_active');
        error = updateError;
        if (updatedData) {
          console.log('Profile updated successfully:', updatedData);
        }
      } else {
        // Create new profile (in case trigger didn't fire) - include user_id for insert
        console.log('Creating new profile for user:', userId);
        console.log('Profile data to insert:', { ...profileData, user_id: userId });
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert({
            ...profileData,
            user_id: userId
          })
          .select('id, first_name, birth_date, email, gender, city, country, profession, languages, ethnicity, drinking, smoking, bio, qualities, looking_for, involvement_percent, photo_url, onboarding_completed, is_public, is_active');
        error = insertError;
        if (insertedData) {
          console.log('Profile created successfully:', insertedData);
        }
      }

      if (error) {
        console.error('Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Onboarding completed successfully!');
      
      // Invalidate profile queries to force refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      // Wait a bit for the database to be ready and cache to be invalidated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refetch the profile to ensure it's available
      await queryClient.refetchQueries({ queryKey: ['profile', 'current'] });
      
      toast({
        title: 'Welcome to Kindly!',
        description: 'Your profile is ready. Start exploring.'
      });
      
      // Navigate after ensuring profile is available
      setTimeout(() => {
        navigate('/profile');
      }, 500);
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete onboarding. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'About You' },
    { number: 3, title: 'Values & Custody' }
  ];

  // Calculate age correctly (accounting for whether birthday has passed this year)
  const calculateAge = (birthDateString: string): number | null => {
    if (!birthDateString) return null;
    const today = new Date();
    const birthDate = new Date(birthDateString + 'T00:00:00');
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = birthDate ? calculateAge(birthDate) : null;

  // Show loading state while initializing
  if (isInitializing || !userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const validateStep = (stepNumber: number): boolean => {
    const errors: string[] = [];
    
    if (stepNumber === 1) {
      if (!birthDate) errors.push('Birthdate');
      if (!gender) errors.push('Gender');
      if (lookingFor.length === 0) errors.push('Looking For');
      if (!city.trim()) errors.push('Location');
    } else if (stepNumber === 2) {
      if (!bio.trim()) errors.push('Bio');
      if (!profession.trim()) errors.push('Profession');
      if (languages.length === 0) errors.push('Languages');
      if (!ethnicity) errors.push('Ethnicity');
      if (!drinking) errors.push('Drinking');
      if (!smoking) errors.push('Smoking');
    } else if (stepNumber === 3) {
      if (qualities.length !== 3) errors.push('Core Values (select exactly 3)');
    }
    
    if (errors.length > 0) {
      setStepErrors({ ...stepErrors, [stepNumber]: errors });
      toast({
        title: 'Please complete all fields',
        description: `Missing: ${errors.join(', ')}`,
        variant: 'destructive'
      });
      return false;
    }
    
    // Clear errors for this step
    setStepErrors({ ...stepErrors, [stepNumber]: [] });
    return true;
  };

  const handleStepContinue = (nextStep: number) => {
    if (validateStep(step)) {
      setStep(nextStep);
    }
  };

  const toggleLanguage = (lang: string) => {
    const newLanguages = languages.includes(lang)
      ? languages.filter(l => l !== lang)
      : [...languages, lang];
    setLanguages(newLanguages);
    // Clear error when user selects at least one language
    if (stepErrors[2]?.includes('Languages') && newLanguages.length > 0) {
      setStepErrors({ ...stepErrors, [2]: stepErrors[2]?.filter(e => e !== 'Languages') || [] });
    }
  };

  const toggleQuality = (quality: string) => {
    if (qualities.includes(quality)) {
      const newQualities = qualities.filter(q => q !== quality);
      setQualities(newQualities);
      // Clear error when user selects exactly 3 values
      if (stepErrors[3]?.includes('Core Values') && newQualities.length === 3) {
        setStepErrors({ ...stepErrors, [3]: stepErrors[3]?.filter(e => e !== 'Core Values') || [] });
      }
    } else {
      // Limit to exactly 3 values
      if (qualities.length >= 3) {
        toast({
          title: 'Maximum 3 values',
          description: 'Please select exactly 3 core values.',
          variant: 'destructive'
        });
        return;
      }
      const newQualities = [...qualities, quality];
      setQualities(newQualities);
      // Clear error when user selects exactly 3 values
      if (stepErrors[3]?.includes('Core Values') && newQualities.length === 3) {
        setStepErrors({ ...stepErrors, [3]: stepErrors[3]?.filter(e => e !== 'Core Values') || [] });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative p-6 flex items-center justify-center border-b border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute left-4 top-1/2 -translate-y-1/2 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigateToLandingTop(navigate, location)}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to home</span>
          <span className="sm:hidden">Home</span>
        </Button>
        <button
          type="button"
          onClick={() => navigateToLandingTop(navigate, location)}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Kindly home"
        >
          <img src={kindlyLogo} alt="Kindly" className="h-8" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  step > s.number
                    ? 'bg-success text-success-foreground'
                    : step === s.number
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s.number ? <CheckCircle className="w-4 h-4" /> : s.number}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 ${
                    step > s.number ? 'bg-success' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {step} of {steps.length}: {steps[step - 1].title}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-md"
        >
          {/* Step 1: Birthdate, Gender, Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Let's get started
                </h1>
                <p className="text-muted-foreground mb-6">
                  Tell us a bit about yourself
                </p>
              </div>

              {/* Birthdate */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Birthdate *
                </label>
                <DatePickerDropdown
                  value={birthDate}
                  onChange={(date) => {
                    setBirthDate(date || '');
                    // Clear error when user starts filling
                    if (stepErrors[1]?.includes('Birthdate')) {
                      setStepErrors({ ...stepErrors, [1]: stepErrors[1]?.filter(e => e !== 'Birthdate') || [] });
                    }
                  }}
                  maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                  minDate={new Date(new Date().setFullYear(1950))}
                  error={stepErrors[1]?.includes('Birthdate')}
                />
                {age !== null && <p className="text-sm text-muted-foreground mt-2">Age: {age}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Gender *
                </label>
                <div className="space-y-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                    setGender(option.value as 'male' | 'female');
                    // Clear error when user selects gender
                    if (stepErrors[1]?.includes('Gender')) {
                      setStepErrors({ ...stepErrors, [1]: stepErrors[1]?.filter(e => e !== 'Gender') || [] });
                    }
                  }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        gender === option.value
                          ? 'border-primary bg-primary/10'
                          : stepErrors[1]?.includes('Gender')
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Looking For - Only show if gender is selected */}
              {gender && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    What are you looking for? * (select all that apply)
                  </label>
                  <div className="space-y-2">
                    {(gender === 'female' ? lookingForOptionsWoman : lookingForOptionsMan).map((option) => {
                      const isSelected = lookingFor.includes(option.value);
                      const hasError = stepErrors[1]?.includes('Looking For') && lookingFor.length === 0;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setLookingFor(lookingFor.filter(v => v !== option.value));
                            } else {
                              setLookingFor([...lookingFor, option.value]);
                            }
                            // Clear error when user selects at least one option
                            if (stepErrors[1]?.includes('Looking For')) {
                              const newLookingFor = isSelected ? lookingFor.filter(v => v !== option.value) : [...lookingFor, option.value];
                              if (newLookingFor.length > 0) {
                                setStepErrors({ ...stepErrors, [1]: stepErrors[1]?.filter(e => e !== 'Looking For') || [] });
                              }
                            }
                          }}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : hasError
                              ? '!border-destructive !border-2 bg-destructive/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary border-primary' : hasError ? 'border-destructive' : 'border-border'
                            }`}>
                              {isSelected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Location *
                </label>
                <div className={stepErrors[1]?.includes('Location') ? '!border-2 !border-destructive rounded-lg p-1' : ''}>
                  <CitySearchInput
                    value={city}
                    onChange={(selectedCity, selectedCountry) => {
                      setCity(selectedCity);
                      setCountry(selectedCountry);
                      // Clear error when user selects location
                      if (stepErrors[1]?.includes('Location') && selectedCity.trim()) {
                        setStepErrors({ ...stepErrors, [1]: stepErrors[1]?.filter(e => e !== 'Location') || [] });
                      }
                    }}
                    placeholder="Search for your city"
                  />
                </div>
              </div>

              {stepErrors[1] && stepErrors[1].length > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium mb-1">Please complete:</p>
                  <ul className="text-sm text-destructive list-disc list-inside">
                    {stepErrors[1].map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button
                onClick={() => handleStepContinue(2)}
                disabled={!birthDate || !gender || lookingFor.length === 0 || !city.trim()}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  opacity: (!birthDate || !gender || lookingFor.length === 0 || !city.trim()) ? 0.5 : 1,
                  cursor: (!birthDate || !gender || lookingFor.length === 0 || !city.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Photo Upload, Bio, Profession, Languages, Ethnicity, Drinking, Smoking */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Tell us more
                </h1>
                <p className="text-muted-foreground mb-6">
                  Share your background and lifestyle
                </p>
              </div>

              {/* Photo Upload - Moved to top */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Profile Photo (optional)
                </label>
                <div className="space-y-2">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto overflow-hidden relative">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {photoFile ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {photoFile && (
                    <p className="text-sm text-muted-foreground text-center">
                      {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Bio *
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    // Clear error when user starts typing
                    if (stepErrors[2]?.includes('Bio') && e.target.value.trim()) {
                      setStepErrors({ ...stepErrors, [2]: stepErrors[2]?.filter(e => e !== 'Bio') || [] });
                    }
                  }}
                  placeholder="Share a bit about who you are, your values, and what you're looking for in a co-parenting partnership..."
                  style={{
                    borderColor: stepErrors[2]?.includes('Bio') ? 'hsl(0 70% 60%)' : undefined,
                    borderWidth: stepErrors[2]?.includes('Bio') ? '2px' : undefined
                  }}
                  className="min-h-[120px] text-base"
                  maxLength={500}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {bio.length}/500 characters
                </p>
              </div>

              {/* Profession */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Profession *
                </label>
                <Input
                  type="text"
                  value={profession}
                  onChange={(e) => {
                    setProfession(e.target.value);
                    // Clear error when user starts typing
                    if (stepErrors[2]?.includes('Profession') && e.target.value.trim()) {
                      setStepErrors({ ...stepErrors, [2]: stepErrors[2]?.filter(e => e !== 'Profession') || [] });
                    }
                  }}
                  placeholder="e.g., Software Engineer, Teacher, Designer"
                  style={{
                    borderColor: stepErrors[2]?.includes('Profession') ? 'hsl(0 70% 60%)' : undefined,
                    borderWidth: stepErrors[2]?.includes('Profession') ? '2px' : undefined
                  }}
                  className="h-14 text-lg"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Languages you speak *
                </label>
                <div className="space-y-2">
                  <div 
                    style={{
                      borderColor: stepErrors[2]?.includes('Languages') ? 'hsl(0 70% 60%)' : undefined,
                      borderWidth: stepErrors[2]?.includes('Languages') ? '2px' : undefined
                    }}
                    className="flex flex-wrap gap-2 p-3 rounded-lg border bg-card min-h-[60px] border-border"
                  >
                    {languages.length === 0 ? (
                      <span className="text-muted-foreground/60 text-sm">Select languages</span>
                    ) : (
                      languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground flex items-center gap-2"
                        >
                          {lang}
                          <button
                            onClick={() => toggleLanguage(lang)}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  {showLanguageSelector ? (
                    <div ref={languageSelectorRef} className="p-3 rounded-lg border border-border bg-card max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {allLanguages.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => toggleLanguage(lang)}
                            className={`p-2 rounded-lg text-sm text-left transition-colors ${
                              languages.includes(lang)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowLanguageSelector(false)}
                        className="w-full mt-3"
                        size="sm"
                      >
                        Done
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowLanguageSelector(true)}
                      className="w-full"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      {languages.length > 0 ? `Add more languages (${languages.length} selected)` : 'Select languages'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Ethnicity */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Ethnicity *
                </label>
                <div className="space-y-2">
                  {ethnicityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setEthnicity(option.value);
                        // Clear error when user selects ethnicity
                        if (stepErrors[2]?.includes('Ethnicity')) {
                          setStepErrors({ ...stepErrors, [2]: stepErrors[2]?.filter(e => e !== 'Ethnicity') || [] });
                        }
                      }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        ethnicity === option.value
                          ? 'border-primary bg-primary/10'
                          : stepErrors[2]?.includes('Ethnicity')
                          ? '!border-destructive !border-2 bg-destructive/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drinking */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Drinking *
                </label>
                <div className="space-y-2">
                  {drinkingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDrinking(option.value);
                        // Clear error when user selects drinking
                        if (stepErrors[2]?.includes('Drinking')) {
                          setStepErrors({ ...stepErrors, [2]: stepErrors[2]?.filter(e => e !== 'Drinking') || [] });
                        }
                      }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        drinking === option.value
                          ? 'border-primary bg-primary/10'
                          : stepErrors[2]?.includes('Drinking')
                          ? '!border-destructive !border-2 bg-destructive/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Smoking */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Smoking *
                </label>
                <div className="space-y-2">
                  {smokingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSmoking(option.value);
                        // Clear error when user selects smoking
                        if (stepErrors[2]?.includes('Smoking')) {
                          setStepErrors({ ...stepErrors, [2]: stepErrors[2]?.filter(e => e !== 'Smoking') || [] });
                        }
                      }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        smoking === option.value
                          ? 'border-primary bg-primary/10'
                          : stepErrors[2]?.includes('Smoking')
                          ? '!border-destructive !border-2 bg-destructive/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {stepErrors[2] && stepErrors[2].length > 0 && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium mb-1">Please complete:</p>
                  <ul className="text-sm text-destructive list-disc list-inside">
                    {stepErrors[2].map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={() => handleStepContinue(3)}
                  disabled={!bio.trim() || !profession.trim() || languages.length === 0 || !ethnicity || !drinking || !smoking}
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  style={{
                    opacity: (!bio.trim() || !profession.trim() || languages.length === 0 || !ethnicity || !drinking || !smoking) ? 0.5 : 1,
                    cursor: (!bio.trim() || !profession.trim() || languages.length === 0 || !ethnicity || !drinking || !smoking) ? 'not-allowed' : 'pointer'
                  }}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Values & Custody */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Values & Custody
                </h1>
                <p className="text-muted-foreground mb-6">
                  What matters to you and your custody preference
                </p>
              </div>

              {/* Values */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Core Values (select exactly 3) *
                </label>
                <div className="space-y-2">
                  <div className={`flex flex-wrap gap-2 p-3 rounded-lg border bg-card min-h-[60px] ${
                    stepErrors[3]?.includes('Core Values') ? '!border-destructive !border-2' : 'border-border'
                  }`}>
                    {qualities.length === 0 ? (
                      <span className="text-muted-foreground/60 text-sm">Select values</span>
                    ) : (
                      qualities.map((quality) => (
                        <span
                          key={quality}
                          className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground flex items-center gap-2"
                        >
                          {quality}
                          <button
                            onClick={() => toggleQuality(quality)}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  {showQualitiesSelector ? (
                    <div ref={qualitiesSelectorRef} className="p-3 rounded-lg border border-border bg-card max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {qualitiesOptions.map((quality) => (
                          <button
                            key={quality}
                            onClick={() => toggleQuality(quality)}
                            className={`p-2 rounded-lg text-sm text-left transition-colors ${
                              qualities.includes(quality)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80'
                            }`}
                          >
                            {quality}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowQualitiesSelector(false)}
                        className="w-full mt-3"
                        size="sm"
                      >
                        Done
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowQualitiesSelector(true)}
                      className="w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {qualities.length > 0 ? `Select values (${qualities.length}/3 selected)` : 'Select values'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Custody */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Custody Preference: {involvementPercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={involvementPercent}
                  onChange={(e) => setInvolvementPercent(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={isLoading || isUploadingPhoto || qualities.length !== 3}
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  style={{
                    opacity: (isLoading || isUploadingPhoto || qualities.length !== 3) ? 0.5 : 1,
                    cursor: (isLoading || isUploadingPhoto || qualities.length !== 3) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading || isUploadingPhoto ? (isUploadingPhoto ? 'Uploading...' : 'Saving...') : 'Complete Setup'}
                  {!isLoading && !isUploadingPhoto && <CheckCircle className="w-5 h-5 ml-2" />}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
