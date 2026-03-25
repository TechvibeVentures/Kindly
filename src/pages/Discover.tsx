import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { CandidateCard } from '@/components/CandidateCard';
import { FilterModal } from '@/components/FilterModal';
import { Button } from '@/components/ui/button';
import { ethnicityLabels, genderOptions } from '@/lib/utils/candidateLabels';
import { getLookingForLabel } from '@/lib/lookingForOptions';

export default function Discover() {
  const { filteredCandidates, filters } = useApp();
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);

  const filterBadges = (() => {
    const badges: string[] = [];

    const [ageMin, ageMax] = filters.ageRange ?? [25, 50];
    if (ageMin !== 25 || ageMax !== 50) badges.push(`Age ${ageMin}-${ageMax}`);

    const loc = filters.location?.trim();
    if (loc) badges.push(`Location: ${loc}`);

    const distance = filters.maxDistance ?? 500;
    if (distance !== 500) badges.push(`Distance: ${distance} km`);

    if (filters.openToRelocation) badges.push('Open to relocation');

    if (filters.ethnicity?.length) {
      badges.push(
        `Ethnicity: ${filters.ethnicity
          .map((v) => ethnicityLabels[v] ?? v)
          .slice(0, 3)
          .join(', ')}`
      );
    }

    if (filters.languages?.length) {
      badges.push(`Languages: ${filters.languages.slice(0, 3).join(', ')}`);
    }

    if (filters.lookingFor?.length) {
      badges.push(
        `Looking for: ${filters.lookingFor
          .slice(0, 2)
          .map(getLookingForLabel)
          .join(', ')}`
      );
    }

    if (filters.gender?.length) {
      badges.push(
        `Gender: ${filters.gender
          .map((v) => genderOptions.find((o) => o.value === v)?.label ?? v)
          .slice(0, 2)
          .join(', ')}`
      );
    }

    const [custMin, custMax] = filters.custodyRange ?? [0, 100];
    if (custMin !== 0 || custMax !== 100) badges.push(`Custody: ${custMin}%-${custMax}%`);

    return badges;
  })();

  const maxBadgesToShow = 3;
  const visibleBadges = filterBadges.slice(0, maxBadgesToShow);
  const extraBadges = Math.max(0, filterBadges.length - maxBadgesToShow);

  return (
    <div className="pb-24 md:pb-0">
      {/* Desktop Header */}
      <div className="hidden md:block bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t.discover}</h1>
              <p className="text-muted-foreground mt-1">
                {filteredCandidates.length} {t.potentialCoParents}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowFilters(true)} variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                {t.filters}
              </Button>
            </div>
          </div>

          {filterBadges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {visibleBadges.map((b, idx) => (
                <span key={`${b}-${idx}`} className="kindly-chip kindly-chip-primary">
                  {b}
                </span>
              ))}
              {extraBadges > 0 && <span className="kindly-chip">+{extraBadges} more</span>}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{t.discover}</h1>
            <p className="text-sm text-muted-foreground">
              {filteredCandidates.length} {t.potentialCoParents}
            </p>
          </div>
          <motion.button
            onClick={() => setShowFilters(true)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 kindly-btn-secondary"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t.filters}
          </motion.button>
        </div>
      </div>

      {filterBadges.length > 0 && (
        <div className="md:hidden px-4 pt-3 pb-2 flex flex-wrap gap-2">
          {visibleBadges.map((b, idx) => (
            <span key={`${b}-${idx}`} className="kindly-chip kindly-chip-primary">
              {b}
            </span>
          ))}
          {extraBadges > 0 && <span className="kindly-chip">+{extraBadges} more</span>}
        </div>
      )}

      {/* Desktop Grid View */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-8">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground text-lg">{t.noMatches}</p>
            <Button onClick={() => setShowFilters(true)} className="mt-4">
              {t.adjustFilters}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCandidates.map((candidate, index) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={index} variant="grid" />
            ))}
          </div>
        )}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden p-4">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.noMatches}</p>
            <button 
              onClick={() => setShowFilters(true)}
              className="kindly-btn-primary mt-4"
            >
              {t.adjustFilters}
            </button>
          </div>
        ) : (
          filteredCandidates.map((candidate, index) => (
            <CandidateCard key={candidate.id} candidate={candidate} index={index} />
          ))
        )}
      </div>

      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </div>
  );
}
