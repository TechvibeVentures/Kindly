import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import type { Candidate } from '@/lib/utils/candidateMapper';
import type { Topic } from '@/data/conversations';
import { useAuth } from '@/hooks/useAuth';
import { useCandidates } from '@/hooks/useCandidates';
import { mapProfilesToCandidates } from '@/lib/utils/candidateMapper';
import { normalizeLookingForValue } from '@/lib/lookingForOptions';
import { useCurrentUserProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'seeker' | 'candidate';

interface Filters {
  ageRange: [number, number];
  location: string;
  maxDistance: number;
  openToRelocation: boolean;
  ethnicity: string[];
  languages: string[];
  lookingFor: string[];
  /** Empty = any gender; values: male, female, non-binary */
  gender: string[];
  custodyRange: [number, number];
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUserPhotoUrl: string | null;
  setCurrentUserPhotoUrl: (url: string | null) => void;
  shortlist: string[];
  addToShortlist: (id: string) => void;
  removeFromShortlist: (id: string) => void;
  isInShortlist: (id: string) => boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  filteredCandidates: Candidate[];
  candidates: Candidate[];
  candidatesLoading: boolean;
  getTopicStatus: (topic: Topic) => 'none' | 'partial' | 'covered';
}

const defaultFilters: Filters = {
  ageRange: [25, 50],
  location: '',
  maxDistance: 500,
  openToRelocation: false,
  ethnicity: [],
  languages: [],
  lookingFor: [],
  gender: [],
  custodyRange: [0, 100]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userRole, setUserRoleState] = useState<UserRole>('seeker');
  const [currentUserPhotoUrl, setCurrentUserPhotoUrl] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const FILTERS_STORAGE_KEY = 'kindley.discover.filters.v1';
  const [filters, setFilters] = useState<Filters>(() => {
    if (typeof window === 'undefined') return defaultFilters;
    try {
      const raw = window.localStorage.getItem(FILTERS_STORAGE_KEY);
      if (!raw) return defaultFilters;
      const parsed = JSON.parse(raw) as Partial<Filters>;
      return {
        ...defaultFilters,
        ...parsed,
        ageRange: Array.isArray(parsed.ageRange) && parsed.ageRange.length === 2 ? parsed.ageRange as [number, number] : defaultFilters.ageRange,
        custodyRange: Array.isArray(parsed.custodyRange) && parsed.custodyRange.length === 2 ? parsed.custodyRange as [number, number] : defaultFilters.custodyRange,
        location: typeof parsed.location === 'string' ? parsed.location : defaultFilters.location,
        maxDistance: typeof parsed.maxDistance === 'number' ? parsed.maxDistance : defaultFilters.maxDistance,
        openToRelocation: typeof parsed.openToRelocation === 'boolean' ? parsed.openToRelocation : defaultFilters.openToRelocation,
        ethnicity: Array.isArray(parsed.ethnicity) ? parsed.ethnicity : defaultFilters.ethnicity,
        languages: Array.isArray(parsed.languages) ? parsed.languages : defaultFilters.languages,
        lookingFor: Array.isArray(parsed.lookingFor) ? parsed.lookingFor : defaultFilters.lookingFor,
        gender: Array.isArray(parsed.gender) ? parsed.gender : defaultFilters.gender,
      };
    } catch {
      return defaultFilters;
    }
  });

  const { data: profiles = [], isLoading: candidatesLoading } = useCandidates();
  const { data: currentUserProfile } = useCurrentUserProfile();
  const candidates = useMemo(() => {
    const ownUserId = user?.id ?? null;
    const ownProfileId = currentUserProfile?.id ?? null;
    const othersProfiles = profiles.filter((p) => {
      if (ownUserId && p.user_id === ownUserId) return false;
      if (ownProfileId && p.id === ownProfileId) return false;
      return true;
    });
    return mapProfilesToCandidates(othersProfiles, currentUserProfile);
  }, [profiles, currentUserProfile, user?.id]);

  // Load app_mode and photo_url from profile so nav and header reflect current user
  useEffect(() => {
    if (!user) {
      setUserRoleState('seeker');
      setCurrentUserPhotoUrl(null);
      return;
    }
    supabase
      .from('profiles')
      .select('app_mode, photo_url')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const row = data as { app_mode?: string; photo_url?: string | null } | null;
        const mode = row?.app_mode;
        if (mode === 'seeker' || mode === 'candidate') {
          setUserRoleState(mode);
        }
        setCurrentUserPhotoUrl(row?.photo_url ?? null);
      });
  }, [user]);

  // Persist Discover filters so the last used parameters are restored.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // Ignore quota/private-mode errors.
    }
  }, [filters]);

  const setUserRole = useCallback(
    async (role: UserRole) => {
      setUserRoleState(role);
      if (!user) return;
      await supabase.from('profiles').update({ app_mode: role } as Record<string, unknown>).eq('user_id', user.id);
    },
    [user]
  );

  const addToShortlist = (id: string) => {
    if (!shortlist.includes(id)) {
      setShortlist([...shortlist, id]);
    }
  };

  const removeFromShortlist = (id: string) => {
    setShortlist(shortlist.filter(item => item !== id));
  };

  const isInShortlist = (id: string) => shortlist.includes(id);

  const filteredCandidates = useMemo(() => candidates.filter(candidate => {
    const ageMin = filters.ageRange?.[0] ?? 25;
    const ageMax = filters.ageRange?.[1] ?? 50;
    const ageMatch = candidate.age === 0 || (candidate.age >= ageMin && candidate.age <= ageMax);

    const location = filters.location?.trim().toLowerCase() ?? '';
    const locationMatch = !location
      ? true
      : (() => {
          const candidateCity = (candidate.city ?? '').toLowerCase();
          const candidateCountry = (candidate.country ?? '').toLowerCase();
          const combined = `${candidateCity}, ${candidateCountry}`.trim();

          // Try direct match first (e.g. "Zurich, Switzerland")
          if (combined.includes(location)) return true;

          // Then try "City, Country" split (handles partial matches too)
          const parts = location.split(',').map((p) => p.trim()).filter(Boolean);
          const locCity = parts[0] ?? '';
          const locCountry = parts[1] ?? '';

          if (locCountry && candidateCountry.includes(locCountry)) return true;
          if (!locCountry && locCity && candidateCity.includes(locCity)) return true;
          if (locCity && locCountry) {
            return candidateCity.includes(locCity) || candidateCountry.includes(locCountry);
          }

          return false;
        })();

    // We currently don't have geocoordinates, so distance is approximated as:
    // - if close range (<150km): match by city (when provided), otherwise allow city or country
    // - if far range: match by country (when provided), otherwise allow city or country
    const dist = filters.maxDistance ?? 500;
    const maxDistanceMatch = !location
      ? true
      : (() => {
          const candidateCity = (candidate.city ?? '').toLowerCase();
          const candidateCountry = (candidate.country ?? '').toLowerCase();
          const parts = location.split(',').map((p) => p.trim()).filter(Boolean);
          const locCity = parts[0] ?? '';
          const locCountry = parts[1] ?? '';

          const isClose = dist < 150;
          if (isClose) {
            if (locCity) return candidateCity.includes(locCity);
            // If city isn't provided, fall back to country/city match
            return locCountry ? candidateCountry.includes(locCountry) : true;
          }

          // Far range => country match if possible, else fallback to city match
          if (locCountry) return candidateCountry.includes(locCountry);
          if (locCity) return candidateCity.includes(locCity);
          return true;
        })();

    const openToRelocationMatch = !filters.openToRelocation || candidate.openToRelocation === true;

    const ethnicityMatch = !filters.ethnicity?.length || 
      (candidate.ethnicity && filters.ethnicity.includes(candidate.ethnicity));
    const languageMatch = !filters.languages?.length || 
      (candidate.languages?.length ? filters.languages.some(l => candidate.languages.includes(l)) : true);
    const lookingForMatch = !filters.lookingFor?.length || (() => {
      if (candidate.lookingForTags?.length) {
        const tags = new Set(candidate.lookingForTags.map(normalizeLookingForValue));
        return filters.lookingFor!.some((f) => tags.has(normalizeLookingForValue(f)));
      }
      return (
        candidate.lookingFor &&
        filters.lookingFor!.some((term) =>
          candidate.lookingFor.toLowerCase().includes(term.toLowerCase())
        )
      );
    })();
    const involvementPercent = candidate.involvement?.includes('50/50') ? 50 :
      candidate.involvement?.includes('60/40') ? 60 :
      candidate.involvement?.includes('40/60') ? 40 : 50;
    const custodyMatch = involvementPercent >= (filters.custodyRange?.[0] ?? 0) && 
      involvementPercent <= (filters.custodyRange?.[1] ?? 100);
    const genderMatch =
      !filters.gender?.length ||
      (candidate.gender && filters.gender.includes(candidate.gender));

    return (
      ageMatch &&
      locationMatch &&
      maxDistanceMatch &&
      openToRelocationMatch &&
      ethnicityMatch &&
      languageMatch &&
      lookingForMatch &&
      custodyMatch &&
      genderMatch
    );
  }), [candidates, filters]);

  const getTopicStatus = (topic: Topic): 'none' | 'partial' | 'covered' => {
    if (topic.seekerCovered && topic.candidateCovered) {
      return 'covered';
    }
    if (topic.seekerCovered || topic.candidateCovered) {
      return 'partial';
    }
    return 'none';
  };

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      currentUserPhotoUrl,
      setCurrentUserPhotoUrl,
      shortlist,
      addToShortlist,
      removeFromShortlist,
      isInShortlist,
      filters,
      setFilters,
      filteredCandidates,
      candidates,
      candidatesLoading,
      getTopicStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
