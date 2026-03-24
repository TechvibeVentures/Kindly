import { useState, useEffect, useMemo } from 'react';
import { X, RotateCcw, MapPin, Globe, ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { allLanguages } from '@/lib/utils/candidateLabels';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ProfileEditSheet } from '@/components/ProfileEditSheet';
import { ProfileOptionList } from '@/components/ProfileOptionList';
import { CitySearchInput } from '@/components/CitySearchInput';
import { lookingForFilterOptions } from '@/lib/lookingForOptions';
import { cn } from '@/lib/utils';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const lookingForOptions = lookingForFilterOptions();

const defaultFiltersState = {
  ageRange: [25, 50] as [number, number],
  location: '',
  maxDistance: 500,
  openToRelocation: false,
  ethnicity: [] as string[],
  languages: [] as string[],
  lookingFor: [] as string[],
  gender: [] as string[],
  custodyRange: [0, 100] as [number, number]
};

type EditField = 'ethnicity' | 'languages' | 'lookingFor' | 'location' | null;

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { filters, setFilters } = useApp();
  const { t } = useLanguage();
  const [localFilters, setLocalFilters] = useState({ ...defaultFiltersState, ...filters });
  const [editField, setEditField] = useState<EditField>(null);

  const genderFilterOptions = useMemo(
    () => [
      { value: 'male', label: t.filterGenderMale },
      { value: 'female', label: t.filterGenderFemale },
      { value: 'non-binary', label: t.filterGenderNonBinary },
    ],
    [t]
  );

  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        ...defaultFiltersState,
        ...filters,
        gender: filters.gender ?? [],
      });
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(defaultFiltersState);
  };

  const activeFilterCount = () => {
    let count = 0;
    if (localFilters.ageRange?.[0] !== 25 || localFilters.ageRange?.[1] !== 50) count++;
    if (localFilters.location) count++;
    if (localFilters.maxDistance !== 500) count++;
    if (localFilters.openToRelocation) count++;
    if ((localFilters.ethnicity?.length ?? 0) > 0) count++;
    if ((localFilters.languages?.length ?? 0) > 0) count++;
    if ((localFilters.lookingFor?.length ?? 0) > 0) count++;
    if ((localFilters.gender?.length ?? 0) > 0) count++;
    if (localFilters.custodyRange?.[0] !== 0 || localFilters.custodyRange?.[1] !== 100) count++;
    return count;
  };

  const getEthnicityDisplay = () => {
    if (!localFilters.ethnicity?.length) return '';
    if (localFilters.ethnicity.length === 1) {
      return ethnicityOptions.find(o => o.value === localFilters.ethnicity[0])?.label || '';
    }
    return `${localFilters.ethnicity.length} selected`;
  };

  const getLanguagesDisplay = () => {
    if (!localFilters.languages?.length) return '';
    if (localFilters.languages.length <= 2) {
      return localFilters.languages.join(', ');
    }
    return `${localFilters.languages.length} ${t.language.toLowerCase()}s`;
  };

  const getLookingForDisplay = () => {
    if (!localFilters.lookingFor?.length) return '';
    if (localFilters.lookingFor.length === 1) {
      return lookingForOptions.find(o => o.value === localFilters.lookingFor[0])?.label || '';
    }
    return `${localFilters.lookingFor.length} selected`;
  };

  const getCustodyDisplay = () => {
    const min = localFilters.custodyRange?.[0] ?? 0;
    const max = localFilters.custodyRange?.[1] ?? 100;
    if (min === 0 && max === 100) return 'Any';
    return `${min}% - ${max}%`;
  };

  const FilterRow = ({ 
    icon: Icon, 
    label, 
    value, 
    onClick 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value?: string; 
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3.5 px-1 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors text-left"
    >
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="text-foreground font-medium flex-shrink-0">{label}</span>
      <span className={`flex-1 text-right truncate ${value ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
        {value || 'Any'}
      </span>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
    </button>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
            >
              <div className="sticky top-0 bg-background border-b border-border px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{t.filters}</h2>
                    {activeFilterCount() > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                        {activeFilterCount()} active
                      </span>
                    )}
                  </div>
                  <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[60vh] px-4 py-4 space-y-6">
                {/* Gender — top, inline tags */}
                <div>
                  <p className="font-medium mb-1">{t.gender}</p>
                  <p className="text-xs text-muted-foreground mb-3 leading-snug">
                    {t.filterGenderSelectHint}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {genderFilterOptions.map((opt) => {
                      const selected = localFilters.gender?.includes(opt.value) ?? false;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setLocalFilters((prev) => {
                              const g = prev.gender || [];
                              const has = g.includes(opt.value);
                              return {
                                ...prev,
                                gender: has ? g.filter((x) => x !== opt.value) : [...g, opt.value],
                              };
                            })
                          }
                          className={cn(
                            'px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-colors',
                            selected
                              ? 'border-primary bg-primary/10 text-foreground'
                              : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">Age</p>
                    <span className="text-sm text-muted-foreground">
                      {localFilters.ageRange?.[0] ?? 25} - {localFilters.ageRange?.[1] ?? 50} years
                    </span>
                  </div>
                  <Slider
                    value={localFilters.ageRange}
                    onValueChange={(value) => setLocalFilters(prev => ({
                      ...prev,
                      ageRange: value as [number, number]
                    }))}
                    min={18}
                    max={60}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Location */}
                <div>
                  <p className="font-medium mb-3">Location</p>
                  <div 
                    onClick={() => setEditField('location')}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-border/50 bg-card hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className={localFilters.location ? 'text-foreground' : 'text-muted-foreground/50'}>
                      {localFilters.location || 'Any location'}
                    </span>
                  </div>
                </div>

                {/* Distance to location */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">Distance to location</p>
                    <span className="text-sm text-muted-foreground">
                      {(localFilters.maxDistance ?? 500) >= 500 ? 'Any distance' : `Within ${localFilters.maxDistance} km`}
                    </span>
                  </div>
                  <Slider
                    value={[localFilters.maxDistance ?? 500]}
                    onValueChange={(value) => setLocalFilters(prev => ({
                      ...prev,
                      maxDistance: value[0]
                    }))}
                    min={10}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>

                {/* Open to Relocation */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Open to relocate</span>
                  </div>
                  <Switch
                    checked={localFilters.openToRelocation ?? false}
                    onCheckedChange={(checked) => setLocalFilters(prev => ({
                      ...prev,
                      openToRelocation: checked
                    }))}
                  />
                </div>

                {/* Ethnicity, Languages, Looking For - Row style like ProfileEdit */}
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  <div className="px-4">
                    <FilterRow 
                      icon={Globe}
                      label="Ethnicity" 
                      value={getEthnicityDisplay()} 
                      onClick={() => setEditField('ethnicity')} 
                    />
                    <FilterRow 
                      icon={MessageCircle}
                      label={t.language} 
                      value={getLanguagesDisplay()} 
                      onClick={() => setEditField('languages')} 
                    />
                    <FilterRow 
                      icon={Heart}
                      label="Looking for" 
                      value={getLookingForDisplay()} 
                      onClick={() => setEditField('lookingFor')} 
                    />
                  </div>
                </div>

                {/* Custody Preference - Double Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">Custody Preference</p>
                    <span className="text-sm text-muted-foreground">
                      {getCustodyDisplay()}
                    </span>
                  </div>
                  <Slider
                    value={localFilters.custodyRange ?? [0, 100]}
                    onValueChange={(value) => setLocalFilters(prev => ({
                      ...prev,
                      custodyRange: value as [number, number]
                    }))}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-background border-t border-border px-4 py-4 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 kindly-button bg-secondary text-foreground flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 kindly-button"
                >
                  Apply {t.filters}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Sheets */}
      <ProfileEditSheet
        open={editField === 'location'}
        onOpenChange={(open) => !open && setEditField(null)}
        title="Location"
        subtitle="Filter by location"
      >
        <div className="px-4">
          <CitySearchInput
            value={localFilters.location || ''}
            onChange={(city, country) => setLocalFilters(prev => ({
              ...prev,
              location: city && country ? `${city}, ${country}` : city
            }))}
          />
          <button
            onClick={() => {
              setLocalFilters(prev => ({ ...prev, location: '' }));
              setEditField(null);
            }}
            className="w-full mt-4 py-3 text-center text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear location
          </button>
        </div>
      </ProfileEditSheet>

      <ProfileEditSheet
        open={editField === 'ethnicity'}
        onOpenChange={(open) => !open && setEditField(null)}
        title="Ethnicity"
        subtitle="Select preferred ethnicities"
      >
        <ProfileOptionList
          options={ethnicityOptions}
          value={localFilters.ethnicity || []}
          onChange={(selected) => setLocalFilters(prev => ({
            ...prev,
            ethnicity: Array.isArray(selected) ? selected : [selected]
          }))}
          multiple
          showSaveButton
          onSave={() => setEditField(null)}
        />
      </ProfileEditSheet>

      <ProfileEditSheet
        open={editField === 'languages'}
        onOpenChange={(open) => !open && setEditField(null)}
        title={t.language}
        subtitle="Select preferred languages"
      >
        <ProfileOptionList
          options={allLanguages.map(lang => ({ value: lang, label: lang }))}
          value={localFilters.languages || []}
          onChange={(selected) => setLocalFilters(prev => ({
            ...prev,
            languages: Array.isArray(selected) ? selected : [selected]
          }))}
          multiple
          showSearch
          showSaveButton
          onSave={() => setEditField(null)}
        />
      </ProfileEditSheet>

      <ProfileEditSheet
        open={editField === 'lookingFor'}
        onOpenChange={(open) => !open && setEditField(null)}
        title="Looking For"
        subtitle="Select what you're looking for"
      >
        <ProfileOptionList
          options={lookingForOptions}
          value={localFilters.lookingFor || []}
          onChange={(selected) => setLocalFilters(prev => ({
            ...prev,
            lookingFor: Array.isArray(selected) ? selected : [selected]
          }))}
          multiple
          showSaveButton
          onSave={() => setEditField(null)}
        />
      </ProfileEditSheet>
    </>
  );
}
