import type { Candidate } from '@/lib/utils/candidateMapper';
import { ethnicityLabels, alcoholLabels, smokingLabels } from '@/lib/utils/candidateLabels';
import { MapPin, Heart, Sparkles, Briefcase, Users, Wine, Cigarette, Globe, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  variant?: 'list' | 'grid';
}

export function CandidateCard({ candidate, index, variant = 'list' }: CandidateCardProps) {
  const { addToShortlist, isInShortlist, removeFromShortlist } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const inShortlist = isInShortlist(candidate.id);

  const getEthnicityLabel = (value: string) => {
    return ethnicityLabels[value] || value;
  };

  const getDrinkingLabel = (value: string) => {
    const shortLabels: Record<string, string> = {
      'never': t.never,
      'rarely': t.rarely,
      'socially': t.socially,
      'regularly': t.regularly,
    };
    return shortLabels[value] || alcoholLabels[value] || value;
  };

  const getSmokingLabel = (value: string) => {
    const shortLabels: Record<string, string> = {
      'never': t.nonSmoker,
      'occasionally': t.sometimes,
      'regularly': t.smoker,
      'former': t.formerSmoker,
    };
    return shortLabels[value] || smokingLabels[value] || value;
  };

  const handleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inShortlist) {
      removeFromShortlist(candidate.id);
    } else {
      addToShortlist(candidate.id);
    }
  };

  // Grid variant for desktop - same content as mobile but compact
  if (variant === 'grid') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        onClick={() => navigate(`/candidate/${candidate.id}`)}
        className="bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all group"
      >
        <div className="relative">
          {candidate.photo ? (
            <img 
              src={candidate.photo} 
              alt={candidate.displayName}
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
              <User className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
          
          {/* Compatibility match (weighted score vs your profile) */}
          <div className="absolute top-2 right-2 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 cursor-help border border-transparent hover:border-border text-left"
                >
                  <Sparkles className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-xs font-semibold">
                    {candidate.compatibilityScore}% {t.match}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-[min(320px,85vw)] text-xs leading-relaxed z-[60]">
                {t.matchScoreHowCalculated}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-background">
            <h3 className="text-lg font-bold">
              {candidate.displayName}
              {candidate.age > 0 ? `, ${candidate.age}` : ''}
            </h3>
            {(candidate.city || candidate.country) && (
              <div className="flex items-center gap-1 mt-0.5 opacity-90">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{[candidate.city, candidate.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 space-y-2">
          {/* Key Info Row - only when occupation or languages exist */}
          {(candidate.occupation || (candidate.languages?.length ?? 0) > 0) && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {candidate.occupation && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>{candidate.occupation.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              )}
              {candidate.languages && candidate.languages.length > 0 && (
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>{candidate.languages.slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Lifestyle Pills */}
          <div className="flex flex-wrap gap-1">
            {candidate.ethnicity && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted-foreground">
                <Users className="w-2.5 h-2.5" />
                {getEthnicityLabel(candidate.ethnicity)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted-foreground">
              <Wine className="w-2.5 h-2.5" />
              {getDrinkingLabel(candidate.alcohol)}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted-foreground">
              <Cigarette className="w-2.5 h-2.5" />
              {getSmokingLabel(candidate.smoking)}
            </span>
          </div>

          {/* Bio - only when exists */}
          {candidate.bio && (
            <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">{candidate.bio}</p>
          )}

          {/* Core Values (Creativity, Health, Balance etc.) - only when exist */}
          {candidate.values && candidate.values.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {candidate.values.slice(0, 3).map((value) => (
                <span key={value} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-border text-[10px] text-[#7B91A5]">
                  {value}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground font-medium flex-1 min-w-0 truncate">
              {candidate.involvement || ''}
            </span>
            
            <motion.button
              onClick={handleShortlist}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-colors ${
                inShortlist 
                  ? 'bg-kindly-rose text-destructive' 
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className="w-4 h-4" fill={inShortlist ? 'currentColor' : 'none'} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // List variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => navigate(`/candidate/${candidate.id}`)}
      className="kindly-card mb-4 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        {candidate.photo ? (
          <img 
            src={candidate.photo} 
            alt={candidate.displayName}
            className="w-full aspect-[4/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
        
        <div className="absolute top-3 right-3 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 cursor-help border border-transparent hover:border-border text-left"
              >
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-semibold text-foreground">
                  {candidate.compatibilityScore}% {t.match}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[min(320px,85vw)] text-xs leading-relaxed z-[60]">
              {t.matchScoreHowCalculated}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
          <h3 className="text-2xl font-bold">
            {candidate.displayName}
            {candidate.age > 0 ? `, ${candidate.age}` : ''}
          </h3>
          {(candidate.city || candidate.country) && (
            <div className="flex items-center gap-1.5 mt-1 opacity-90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{[candidate.city, candidate.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Info Row - only when occupation or languages exist */}
        {(candidate.occupation || (candidate.languages?.length ?? 0) > 0) && (
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {candidate.occupation && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{candidate.occupation.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            )}
            {candidate.languages && candidate.languages.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>{candidate.languages.slice(0, 2).join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {/* Lifestyle Pills */}
        <div className="flex flex-wrap gap-2">
          {candidate.ethnicity && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              {getEthnicityLabel(candidate.ethnicity)}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
            <Wine className="w-3 h-3" />
            {getDrinkingLabel(candidate.alcohol)}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
            <Cigarette className="w-3 h-3" />
            {getSmokingLabel(candidate.smoking)}
          </span>
        </div>

        {/* Bio - only when exists */}
        {candidate.bio && (
          <p className="text-foreground/80 leading-relaxed line-clamp-2">{candidate.bio}</p>
        )}

        {/* Core Values (Creativity, Health, Balance etc.) - only when exist */}
        {candidate.values && candidate.values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {candidate.values.slice(0, 3).map((value) => (
              <span key={value} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs text-[#7B91A5]">
                {value}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground font-medium flex-1 min-w-0 truncate">
            {candidate.involvement || ''}
          </span>
          
          <motion.button
            onClick={handleShortlist}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full transition-colors ${
              inShortlist 
                ? 'bg-kindly-rose text-destructive' 
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="w-5 h-5" fill={inShortlist ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}