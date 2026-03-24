import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useCurrentUserProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateProfileCompletion } from '@/lib/utils/profileCompletion';
import { ChevronLeft, CheckCircle, ArrowRight, Briefcase, User, Heart, Users, Sparkles, Globe, MapPin, Home, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileOptionList } from '@/components/ProfileOptionList';
import { ProfileChipCard } from '@/components/ProfileChipCard';
import { ProfileEditSheet } from '@/components/ProfileEditSheet';
import { CitySearchInput } from '@/components/CitySearchInput';
import { allLanguages } from '@/lib/utils/candidateLabels';
import { supabase } from '@/integrations/supabase/client';
import { LOOKING_FOR_OPTIONS } from '@/lib/lookingForOptions';

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

const interestOptions = [
  '🎵 Music', '📚 Reading', '🎮 Gaming', '✈️ Travel', '🎬 Movies',
  '🍳 Cooking', '🏃 Running', '🧘 Yoga', '📷 Photography', '🎨 Art',
  '🌱 Gardening', '🎭 Theatre', '⚽ Sports', '💃 Dancing', '🍷 Wine',
];

const causesOptions = [
  'Environmentalism', 'Feminism', 'LGBTQ+ Rights', 'Animal Rights',
  'Mental Health', 'Racial Equality', 'Education', 'Climate Action',
];

const relationshipStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
];

interface Section {
  id: string;
  title: string;
  titleKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: string[];
  completed: boolean;
}

export default function ProfileCompletionWizard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: profile } = useCurrentUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const { toast } = useToast();
  
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0 = section selection, 1+ = editing section
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state for each section
  const [profession, setProfession] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [hometown, setHometown] = useState('');
  const [hometownCountry, setHometownCountry] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [height, setHeight] = useState<number>(165);
  const [weight, setWeight] = useState<number>(65);
  const [ethnicity, setEthnicity] = useState('');
  const [sexuality, setSexuality] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [exercise, setExercise] = useState('');
  const [drinking, setDrinking] = useState('');
  const [smoking, setSmoking] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [causes, setCauses] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [involvementPercent, setInvolvementPercent] = useState<number>(50);
  const [parentingPhilosophy, setParentingPhilosophy] = useState('');
  const [financialSituation, setFinancialSituation] = useState('');
  const [lifestyleRhythm, setLifestyleRhythm] = useState('');
  
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showInterestsSelector, setShowInterestsSelector] = useState(false);
  const [showCausesSelector, setShowCausesSelector] = useState(false);
  const [showLookingForSelector, setShowLookingForSelector] = useState(false);
  const languageSelectorRef = useRef<HTMLDivElement>(null);
  const interestsSelectorRef = useRef<HTMLDivElement>(null);
  const causesSelectorRef = useRef<HTMLDivElement>(null);
  const lookingForSelectorRef = useRef<HTMLDivElement>(null);
  
  const completionPercent = profile ? calculateProfileCompletion(profile) : 0;

  // Load profile data into form state
  useEffect(() => {
    if (profile) {
      setProfession(profile.profession || '');
      setDegree(profile.degree || profile.studies || '');
      setFieldOfStudy(profile.field_of_study || '');
      setSchool(profile.school || '');
      setCity(profile.city || '');
      setCountry(profile.country || '');
      setHometown(profile.hometown || '');
      setHometownCountry(profile.hometown_country || '');
      setLanguages(profile.languages || []);
      setHeight(profile.height || 165);
      setWeight(profile.weight || 65);
      setEthnicity(profile.ethnicity || '');
      setSexuality(profile.sexuality || '');
      setRelationshipStatus(profile.relationship_status || '');
      setExercise(profile.exercise || '');
      setDrinking(profile.drinking || '');
      setSmoking(profile.smoking || '');
      setInterests(profile.interests || []);
      setCauses(profile.causes || []);
      setLookingFor(profile.looking_for || []);
      setInvolvementPercent(profile.involvement_percent || 50);
      setParentingPhilosophy(profile.parenting_philosophy || '');
      setFinancialSituation(profile.financial_situation || '');
      setLifestyleRhythm(profile.lifestyle_rhythm || '');
    }
  }, [profile]);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target as Node)) {
        setShowLanguageSelector(false);
      }
      if (interestsSelectorRef.current && !interestsSelectorRef.current.contains(event.target as Node)) {
        setShowInterestsSelector(false);
      }
      if (causesSelectorRef.current && !causesSelectorRef.current.contains(event.target as Node)) {
        setShowCausesSelector(false);
      }
      if (lookingForSelectorRef.current && !lookingForSelectorRef.current.contains(event.target as Node)) {
        setShowLookingForSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define sections with their completion status
  // About You: Fields match ProfileEdit section (work/profession, education, location, hometown, languages)
  const sections: Section[] = [
    {
      id: 'about-you',
      title: t.aboutYou,
      icon: Briefcase,
      fields: ['profession', 'education', 'city', 'hometown', 'languages'],
      completed: (
        (profile?.profession?.trim() ?? '').length > 0 &&
        ((profile?.degree?.trim() ?? '').length > 0 || (profile?.field_of_study?.trim() ?? '').length > 0 || (profile?.school?.trim() ?? '').length > 0 || (profile?.studies?.trim() ?? '').length > 0) &&
        (profile?.city?.trim() ?? '').length > 0 &&
        (profile?.hometown?.trim() ?? '').length > 0 &&
        Array.isArray(profile?.languages) && profile.languages.length > 0
      )
    },
    {
      id: 'characteristics',
      title: 'Characteristics',
      icon: User,
      fields: ['height', 'weight', 'ethnicity', 'sexuality', 'relationship_status', 'exercise', 'drinking', 'smoking'],
      completed: !!(
        profile?.height &&
        profile?.weight &&
        profile?.ethnicity &&
        profile?.sexuality &&
        profile?.relationship_status &&
        profile?.exercise &&
        profile?.drinking &&
        profile?.smoking
      )
    },
    {
      id: 'interests-causes',
      title: 'Interests + Causes & Communities',
      icon: Heart,
      fields: ['interests', 'causes'],
      completed: !!(
        profile?.interests && profile.interests.length > 0 &&
        profile?.causes && profile.causes.length > 0
      )
    },
    {
      id: 'co-parenting',
      title: 'Co-Parenting Preferences',
      icon: Users,
      fields: ['looking_for', 'involvement_percent', 'parenting_philosophy', 'financial_situation', 'lifestyle_rhythm'],
      completed: !!(
        profile?.looking_for && profile.looking_for.length > 0 &&
        profile?.involvement_percent !== null && profile?.involvement_percent !== undefined &&
        profile?.parenting_philosophy &&
        profile?.financial_situation &&
        profile?.lifestyle_rhythm
      )
    }
  ];

  const incompleteSections = sections.filter(s => !s.completed);

  const handleStartSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    setStep(1);
  };

  // Scroll to top when entering a section
  useEffect(() => {
    if (currentSection && step === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection, step]);

  const handleSaveSection = async () => {
    if (!currentSection) return;
    
    setIsSaving(true);
    try {
      const updateData: any = {};
      
      switch (currentSection) {
        case 'about-you':
          updateData.profession = profession;
          updateData.degree = degree || null;
          updateData.field_of_study = fieldOfStudy || null;
          updateData.school = school || null;
          updateData.studies = degree || fieldOfStudy || null; // Keep studies for backward compatibility
          updateData.city = city;
          updateData.country = country;
          updateData.hometown = hometown;
          updateData.hometown_country = hometownCountry;
          updateData.languages = languages;
          break;
        case 'characteristics':
          updateData.height = height || null;
          updateData.weight = weight || null;
          updateData.ethnicity = ethnicity || null;
          updateData.sexuality = sexuality || null; // Only save if value is set, otherwise null
          updateData.relationship_status = relationshipStatus || null;
          updateData.exercise = exercise || null;
          updateData.drinking = drinking || null;
          updateData.smoking = smoking || null;
          break;
        case 'interests-causes':
          updateData.interests = interests;
          updateData.causes = causes;
          break;
        case 'co-parenting':
          updateData.looking_for = lookingFor;
          updateData.involvement_percent = involvementPercent;
          updateData.parenting_philosophy = parentingPhilosophy;
          updateData.financial_situation = financialSituation;
          updateData.lifestyle_rhythm = lifestyleRhythm;
          break;
      }
      
      await updateProfileMutation.mutateAsync(updateData);
      
      toast({
        title: 'Section saved!',
        description: 'Your changes have been saved.',
      });
      
      // Move to next incomplete section or back to selection
      const currentIndex = incompleteSections.findIndex(s => s.id === currentSection);
      if (currentIndex < incompleteSections.length - 1) {
        const nextSection = incompleteSections[currentIndex + 1];
        setCurrentSection(nextSection.id);
        setStep(1);
      } else {
        setCurrentSection(null);
        setStep(0);
        toast({
          title: 'Profile complete!',
          description: 'All sections have been completed.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save changes',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter(l => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const toggleCause = (cause: string) => {
    if (causes.includes(cause)) {
      setCauses(causes.filter(c => c !== cause));
    } else {
      setCauses([...causes, cause]);
    }
  };

  const toggleLookingFor = (value: string) => {
    if (lookingFor.includes(value)) {
      setLookingFor(lookingFor.filter(v => v !== value));
    } else {
      setLookingFor([...lookingFor, value]);
    }
  };

  // Section selection view
  if (step === 0) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-8">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{t.completeProfile}</h1>
              <p className="text-sm text-muted-foreground">{t.selectSectionsToComplete}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Progress Overview */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">{t.profileCompletion}</span>
              </div>
              <span className="text-2xl font-bold text-primary">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {t.completeSectionsToImproveProfile}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-card rounded-xl border-2 p-6 cursor-pointer transition-all ${
                    section.completed
                      ? 'border-success/50 bg-success/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleStartSection(section.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      section.completed
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        {section.completed && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {section.completed
                          ? `✓ ${t.thisSectionIsComplete}`
                          : t.clickToCompleteThisSection}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {incompleteSections.length === 0 && (
            <div className="mt-8 p-6 bg-success/10 border border-success/20 rounded-xl text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-1">{t.profileComplete}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t.allSectionsCompleted}</p>
              <Button onClick={() => navigate('/profile')} className="kindly-button-primary">
                {t.backToProfile}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Section editing view
  const currentSectionData = sections.find(s => s.id === currentSection);
  if (!currentSectionData) {
    setStep(0);
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setStep(0);
              setCurrentSection(null);
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{currentSectionData.title}</h1>
            <p className="text-sm text-muted-foreground">
              {incompleteSections.findIndex(s => s.id === currentSection) + 1} of {incompleteSections.length}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* About You Section */}
          {currentSection === 'about-you' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.work}</label>
                <Input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder={t.work}
                  className="h-14 text-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.education}</label>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Degree</label>
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
                      value={degree}
                      onChange={(v) => setDegree(v as string)}
                    />
                  </div>
                  <Input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="Field of study (e.g., Computer Science)"
                    className="h-14 text-lg"
                  />
                  <Input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder={t.schoolOrUniversity}
                    className="h-14 text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.location}</label>
                <CitySearchInput
                  value={city}
                  onChange={(selectedCity, selectedCountry) => {
                    setCity(selectedCity);
                    setCountry(selectedCountry);
                  }}
                  placeholder={t.searchForCity}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.hometown}</label>
                <CitySearchInput
                  value={hometown}
                  onChange={(selectedCity, selectedCountry) => {
                    setHometown(selectedCity);
                    setHometownCountry(selectedCountry);
                  }}
                  placeholder={t.searchForHometown}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.spokenLanguages}</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-card min-h-[60px]">
                    {languages.length === 0 ? (
                      <span className="text-muted-foreground/60 text-sm">{t.selectLanguages}</span>
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
                        {t.done}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowLanguageSelector(true)}
                      className="w-full"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      {languages.length > 0 ? `${t.addMoreLanguages} (${languages.length})` : t.selectLanguages}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Characteristics Section */}
          {currentSection === 'characteristics' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.height}</label>
                <input
                  type="range"
                  min="140"
                  max="210"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>140 cm</span>
                  <span className="font-medium">{height} cm</span>
                  <span>210 cm</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.weight}</label>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>40 kg</span>
                  <span className="font-medium">{weight} kg</span>
                  <span>150 kg</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.ethnicity}</label>
                <ProfileOptionList
                  options={ethnicityOptions}
                  value={ethnicity}
                  onChange={(v) => setEthnicity(v as string)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.sexuality}</label>
                <ProfileOptionList
                  options={sexualityOptions}
                  value={sexuality}
                  onChange={(v) => setSexuality(v as string)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.relationshipStatus}</label>
                <ProfileOptionList
                  options={relationshipStatusOptions}
                  value={relationshipStatus}
                  onChange={(v) => setRelationshipStatus(v as string)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.exercise}</label>
                <ProfileOptionList
                  options={exerciseOptions}
                  value={exercise}
                  onChange={(v) => setExercise(v as string)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.drinking}</label>
                <ProfileOptionList
                  options={drinkingOptions}
                  value={drinking}
                  onChange={(v) => setDrinking(v as string)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.smoking}</label>
                <ProfileOptionList
                  options={smokingOptions}
                  value={smoking}
                  onChange={(v) => setSmoking(v as string)}
                />
              </div>
            </>
          )}

          {/* Interests + Causes Section */}
          {currentSection === 'interests-causes' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.interests}</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-card min-h-[60px]">
                    {interests.length === 0 ? (
                      <span className="text-muted-foreground/60 text-sm">{t.selectInterests}</span>
                    ) : (
                      interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground flex items-center gap-2"
                        >
                          {interest}
                          <button
                            onClick={() => toggleInterest(interest)}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  {showInterestsSelector ? (
                    <div ref={interestsSelectorRef} className="p-3 rounded-lg border border-border bg-card max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`p-2 rounded-lg text-sm text-left transition-colors ${
                              interests.includes(interest)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowInterestsSelector(false)}
                        className="w-full mt-3"
                        size="sm"
                      >
                        {t.done}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowInterestsSelector(true)}
                      className="w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {interests.length > 0 ? `${t.addMoreInterests} (${interests.length})` : t.selectInterests}
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.causesAndCommunities}</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-card min-h-[60px]">
                    {causes.length === 0 ? (
                      <span className="text-muted-foreground/60 text-sm">{t.selectCauses}</span>
                    ) : (
                      causes.map((cause) => (
                        <span
                          key={cause}
                          className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground flex items-center gap-2"
                        >
                          {cause}
                          <button
                            onClick={() => toggleCause(cause)}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  {showCausesSelector ? (
                    <div ref={causesSelectorRef} className="p-3 rounded-lg border border-border bg-card max-h-[200px] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-2">
                        {causesOptions.map((cause) => (
                          <button
                            key={cause}
                            onClick={() => toggleCause(cause)}
                            className={`p-2 rounded-lg text-sm text-left transition-colors ${
                              causes.includes(cause)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80'
                            }`}
                          >
                            {cause}
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowCausesSelector(false)}
                        className="w-full mt-3"
                        size="sm"
                      >
                        {t.done}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowCausesSelector(true)}
                      className="w-full"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {causes.length > 0 ? `${t.addMoreCauses} (${causes.length})` : t.selectCauses}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Co-Parenting Preferences Section */}
          {currentSection === 'co-parenting' && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.lookingFor}</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-card min-h-[60px]">
                    {lookingFor.length === 0 ? (
                      <span className="text-muted-foreground/60 text-sm">{t.selectOptions}</span>
                    ) : (
                      lookingFor.map((value) => {
                        const option = LOOKING_FOR_OPTIONS.find(opt => opt.value === value);
                        return (
                          <span
                            key={value}
                            className="px-3 py-1.5 rounded-full text-sm bg-primary text-primary-foreground flex items-center gap-2"
                          >
                            {option?.label || value}
                            <button
                              onClick={() => toggleLookingFor(value)}
                              className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {showLookingForSelector ? (
                    <div ref={lookingForSelectorRef} className="p-3 rounded-lg border border-border bg-card max-h-[200px] overflow-y-auto">
                      <div className="space-y-2">
                        {LOOKING_FOR_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => toggleLookingFor(option.value)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              lookingFor.includes(option.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80'
                            }`}
                          >
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm opacity-80">{option.description}</div>
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowLookingForSelector(false)}
                        className="w-full mt-3"
                        size="sm"
                      >
                        {t.done}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowLookingForSelector(true)}
                      className="w-full"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      {lookingFor.length > 0 ? `${t.changeSelection} (${lookingFor.length})` : t.selectWhatYoureLookingFor}
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t.custodyPreference}: {involvementPercent}%
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

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.parentingPhilosophy}</label>
                <Textarea
                  value={parentingPhilosophy}
                  onChange={(e) => setParentingPhilosophy(e.target.value)}
                  placeholder={t.describeYourApproachToParenting}
                  className="min-h-[120px] text-base"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.financialSituation}</label>
                <Textarea
                  value={financialSituation}
                  onChange={(e) => setFinancialSituation(e.target.value)}
                  placeholder={t.describeYourFinancialSituation}
                  className="min-h-[120px] text-base"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.lifestyleRhythm}</label>
                <Textarea
                  value={lifestyleRhythm}
                  onChange={(e) => setLifestyleRhythm(e.target.value)}
                  placeholder={t.describeYourDailyRhythmAndLifestyle}
                  className="min-h-[120px] text-base"
                  maxLength={500}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setStep(0);
                setCurrentSection(null);
              }}
              className="flex-1 h-12"
            >
              {t.back}
            </Button>
            <Button
              onClick={handleSaveSection}
              disabled={isSaving}
              className="flex-1 h-12 kindly-button-primary"
            >
              {isSaving ? t.saving : incompleteSections.findIndex(s => s.id === currentSection) < incompleteSections.length - 1 ? t.continue : t.complete}
              {!isSaving && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
