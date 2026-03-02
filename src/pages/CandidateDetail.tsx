import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, MapPin, Briefcase, Sparkles, MessageSquare,
  GraduationCap, Ruler, Dumbbell, Wine, Cigarette, Globe, Home,
  Baby, Users, Scale, RefreshCw, Cannabis, Pill, Salad, Star,
  Landmark, Palette, Dog
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  exerciseLabels, 
  alcoholLabels, 
  smokingLabels,
  cannabisLabels,
  drugsLabels,
  religionLabels,
  politicsLabels,
  ethnicityLabels,
  starSignLabels,
  petsLabels
} from '@/lib/utils/candidateLabels';
import { useApp } from '@/contexts/AppContext';
import { useCandidate } from '@/hooks/useCandidates';
import { useCurrentUserProfile } from '@/hooks/useProfile';
import { mapProfileToCandidate } from '@/lib/utils/candidateMapper';
import { calculateCompatibility } from '@/lib/utils/matchAlgorithm';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useGetOrCreateConversation } from '@/hooks/useConversations';

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToShortlist, isInShortlist, removeFromShortlist } = useApp();
  const getOrCreateConversation = useGetOrCreateConversation();
  const { t } = useLanguage();
  
  // Get profile by ID - RLS will handle access (own profile or public profiles)
  const { data: profile, isLoading } = useCandidate(id || null);
  const { data: ownProfile } = useCurrentUserProfile();
  const candidate = profile ? mapProfileToCandidate(profile) : null;
  const isOwnProfile = ownProfile?.id === id;
  
  // Calculate compatibility score if viewing someone else's profile
  const candidateWithScore = candidate && !isOwnProfile && ownProfile && profile
    ? { ...candidate, compatibilityScore: calculateCompatibility(ownProfile, profile) }
    : candidate;

  const getExerciseLabel = (value: string) => {
    const labels: Record<string, string> = {
      'daily': `${t.active} - ${t.worksOutRegularly}`,
      'several_weekly': `${t.active} - ${t.severalTimesWeek}`,
      'weekly': `${t.sometimes} - ${t.onceAWeek}`,
      'occasionally': `${t.sometimes} - ${t.occasionally}`,
      'rarely': t.almostNever,
    };
    return labels[value] || value;
  };

  const getDrinkingLabel = (value: string) => {
    const labels: Record<string, string> = {
      'never': `${t.never} - ${t.doesntDrink}`,
      'rarely': `${t.rarely} - ${t.onSpecialOccasions}`,
      'socially': `${t.socially} - ${t.whenWithFriends}`,
      'regularly': `${t.regularly} - ${t.mostWeekends}`,
    };
    return labels[value] || value;
  };

  const getSmokingLabel = (value: string) => {
    const labels: Record<string, string> = {
      'never': `${t.no} - ${t.nonSmoker}`,
      'occasionally': `${t.sometimes} - ${t.occasionally}`,
      'regularly': `${t.yes} - ${t.smoker}`,
      'former': t.formerSmoker,
    };
    return labels[value] || value;
  };

  const getCannabisLabel = (value?: string) => {
    if (!value) return null;
    return cannabisLabels[value] || value;
  };

  const getDrugsLabel = (value?: string) => {
    if (!value) return null;
    return drugsLabels[value] || value;
  };

  const getMethodLabel = (value: string) => {
    const labels: Record<string, string> = {
      'natural': t.naturalConception,
      'assisted': t.assistedReproduction,
      'open': t.openToBoth,
    };
    return labels[value] || value;
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-foreground text-sm">{value}</p>
      </div>
    </div>
  );
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!candidateWithScore) {
    return (
      <div className="p-4 text-center">
        <p>{t.candidateNotFound}</p>
        <button onClick={() => navigate(-1)} className="kindly-btn-primary mt-4">
          {t.goBack}
        </button>
      </div>
    );
  }

  const inShortlist = isInShortlist(candidateWithScore.id);

  const handleStartConversation = async () => {
    if (!candidateWithScore?.id) return;
    
    try {
      // Get or create conversation with this candidate
      await getOrCreateConversation.mutateAsync(candidateWithScore.id);
      // Redirect to conversations list where user can continue the chat
      navigate('/conversations');
    } catch (error) {
      console.error('Error starting conversation:', error);
      // Fallback: navigate to conversations page
      navigate('/conversations');
    }
  };

  return (
    <div className="pb-24 md:pb-0">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToDiscover}
        </button>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Photo & Actions */}
          <div className="col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="relative rounded-2xl overflow-hidden">
                {candidateWithScore.photo ? (
                  <img 
                    src={candidateWithScore.photo} 
                    alt={candidateWithScore.displayName}
                    className="w-full aspect-[3/4] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
                    <User className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
                {!isOwnProfile && (
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold">{candidateWithScore.compatibilityScore}% {t.match}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleStartConversation}
                  className="flex-1"
                  size="lg"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t.message}
                </Button>
                <Button
                  variant={inShortlist ? "destructive" : "outline"}
                  size="lg"
                  onClick={() => inShortlist ? removeFromShortlist(candidateWithScore.id) : addToShortlist(candidateWithScore.id)}
                >
                  <Heart className="w-4 h-4" fill={inShortlist ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold">{candidateWithScore.displayName}, {candidateWithScore.age}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{candidateWithScore.city}, {candidateWithScore.country}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{candidateWithScore.occupation}</span>
                </div>
              </div>

              {/* Values */}
              <div className="flex flex-wrap gap-2 mt-4">
                {candidateWithScore.values.map((value) => (
                  <span key={value} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {value}
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-3">{t.aboutMe}</h3>
              <p className="text-foreground leading-relaxed">{candidateWithScore.bio}</p>
            </div>

            {/* Two Column Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* About */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-3">{t.about}</h3>
                <InfoRow icon={Briefcase} label={t.work} value={candidateWithScore.occupation} />
                <InfoRow icon={GraduationCap} label={t.education} value={candidateWithScore.education} />
                <InfoRow icon={MapPin} label={t.location} value={`${candidateWithScore.city}, ${candidateWithScore.country}`} />
                <InfoRow icon={Globe} label={t.spokenLanguages} value={candidateWithScore.languages.join(', ')} />
                {candidateWithScore.height && <InfoRow icon={Ruler} label={t.height} value={`${candidateWithScore.height} cm`} />}
                <InfoRow icon={Users} label={t.relationshipStatus} value={candidateWithScore.relationshipStatus} />
              </div>

              {/* Lifestyle */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-3">{t.lifestyle}</h3>
                <InfoRow icon={Dumbbell} label={t.exercise} value={getExerciseLabel(candidateWithScore.exercise)} />
                <InfoRow icon={Wine} label={t.drinking} value={getDrinkingLabel(candidateWithScore.alcohol)} />
                <InfoRow icon={Cigarette} label={t.smoking} value={getSmokingLabel(candidateWithScore.smoking)} />
                {getCannabisLabel(candidateWithScore.cannabis) && (
                  <InfoRow icon={Cannabis} label={t.cannabis} value={getCannabisLabel(candidateWithScore.cannabis)!} />
                )}
                <InfoRow icon={Salad} label={t.diet} value={candidateWithScore.diet} />
              </div>
            </div>

            {/* Co-Parenting */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-3">{t.coParentingPreferences}</h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow icon={Baby} label={t.custodyPreferenceLabel} value={`${candidateWithScore.involvement} - ${candidateWithScore.involvementFlexibility}`} />
                <InfoRow icon={RefreshCw} label={t.conceptionMethodLabel} value={getMethodLabel(candidateWithScore.preferredMethod)} />
                <InfoRow icon={Home} label={t.openToRelocationLabel} value={candidateWithScore.openToRelocation ? t.yes : t.no} />
                <InfoRow icon={Users} label={t.familySupport} value={candidateWithScore.familySupport} />
              </div>
            </div>

            {/* Philosophy & Financial */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-3">{t.parentingPhilosophy}</h3>
                <p className="text-foreground">{candidateWithScore.parentingPhilosophy}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-3">{t.financialSituation}</h3>
                <p className="text-foreground">{candidateWithScore.financialSituation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Hero Image */}
        <div className="relative">
          {candidateWithScore.photo ? (
            <img 
              src={candidateWithScore.photo} 
              alt={candidateWithScore.displayName}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-muted flex items-center justify-center">
              <User className="w-32 h-32 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
          
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <motion.button
            onClick={() => inShortlist ? removeFromShortlist(candidateWithScore.id) : addToShortlist(candidateWithScore.id)}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-colors ${
              inShortlist ? 'bg-kindly-rose text-destructive' : 'bg-background/80'
            }`}
          >
            <Heart className="w-5 h-5" fill={inShortlist ? 'currentColor' : 'none'} />
          </motion.button>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
            {!isOwnProfile && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 bg-background/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">{candidateWithScore.compatibilityScore}% {t.match}</span>
                </div>
              </div>
            )}
            <h1 className="text-3xl font-bold">{candidateWithScore.displayName}, {candidateWithScore.age}</h1>
            <div className="flex items-center gap-4 mt-2 opacity-90">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{candidateWithScore.city}, {candidateWithScore.country}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Core Values */}
          <div className="flex flex-wrap gap-2">
            {candidateWithScore.values.map((value) => (
              <span key={value} className="kindly-chip-primary">
                {value}
              </span>
            ))}
          </div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="kindly-card p-4"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t.aboutMe}</h3>
            <p className="text-foreground">{candidateWithScore.bio}</p>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="kindly-card p-4 space-y-3"
          >
            <InfoRow icon={Briefcase} label={t.work} value={candidateWithScore.occupation} />
            <InfoRow icon={GraduationCap} label={t.education} value={candidateWithScore.education} />
            <InfoRow icon={MapPin} label={t.location} value={`${candidateWithScore.city}, ${candidateWithScore.country}`} />
            <InfoRow icon={Globe} label={t.spokenLanguages} value={candidateWithScore.languages.join(', ')} />
            {candidateWithScore.height && <InfoRow icon={Ruler} label={t.height} value={`${candidateWithScore.height} cm`} />}
            <InfoRow icon={Users} label={t.relationshipStatus} value={candidateWithScore.relationshipStatus} />
          </motion.div>

          {/* Lifestyle Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="kindly-card p-4 space-y-3"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t.lifestyle}</h3>
            <InfoRow icon={Dumbbell} label={t.exercise} value={getExerciseLabel(candidateWithScore.exercise)} />
            <InfoRow icon={Wine} label={t.drinking} value={getDrinkingLabel(candidateWithScore.alcohol)} />
            <InfoRow icon={Cigarette} label={t.smoking} value={getSmokingLabel(candidateWithScore.smoking)} />
            <InfoRow icon={Salad} label={t.diet} value={candidateWithScore.diet} />
          </motion.div>

          {/* Co-Parenting Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="kindly-card p-4 space-y-3"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t.coParentingPreferences}</h3>
            <InfoRow icon={Baby} label={t.custodyPreferenceLabel} value={candidateWithScore.involvement} />
            <InfoRow icon={RefreshCw} label={t.conceptionMethodLabel} value={getMethodLabel(candidateWithScore.preferredMethod)} />
            <InfoRow icon={Home} label={t.openToRelocationLabel} value={candidateWithScore.openToRelocation ? t.yes : t.no} />
            <InfoRow icon={Users} label={t.familySupport} value={candidateWithScore.familySupport} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="kindly-card p-4"
          >
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t.parentingPhilosophy}</h3>
            <p className="text-foreground">{candidateWithScore.parentingPhilosophy}</p>
          </motion.div>

          {/* CTA */}
          <motion.button
            onClick={handleStartConversation}
            whileTap={{ scale: 0.98 }}
            className="kindly-btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
          >
            <MessageSquare className="w-5 h-5" />
            {t.message} {candidateWithScore.displayName}
          </motion.button>
        </div>
      </div>
    </div>
  );
}