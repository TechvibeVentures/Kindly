import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import type { Candidate } from '@/lib/utils/candidateMapper';
import type { Topic } from '@/data/conversations';
import { useAuth } from '@/hooks/useAuth';
import { useCandidates } from '@/hooks/useCandidates';
import { mapProfilesToCandidates } from '@/lib/utils/candidateMapper';
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
  custodyRange: [0, 100]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userRole, setUserRoleState] = useState<UserRole>('seeker');
  const [currentUserPhotoUrl, setCurrentUserPhotoUrl] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const { data: profiles = [], isLoading: candidatesLoading } = useCandidates();
  const { data: currentUserProfile } = useCurrentUserProfile();
  const candidates = useMemo(() => {
    const mapped = mapProfilesToCandidates(profiles, currentUserProfile);
    const ownProfileId = currentUserProfile?.id;
    if (!ownProfileId) return mapped;
    return mapped.filter(c => c.id !== ownProfileId);
  }, [profiles, currentUserProfile]);

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
    const ethnicityMatch = !filters.ethnicity?.length || 
      (candidate.ethnicity && filters.ethnicity.includes(candidate.ethnicity));
    const languageMatch = !filters.languages?.length || 
      (candidate.languages?.length ? filters.languages.some(l => candidate.languages.includes(l)) : true);
    const lookingForMatch = !filters.lookingFor?.length || 
      (candidate.lookingFor && filters.lookingFor.some(term => candidate.lookingFor.toLowerCase().includes(term.toLowerCase())));
    const involvementPercent = candidate.involvement?.includes('50/50') ? 50 :
      candidate.involvement?.includes('60/40') ? 60 :
      candidate.involvement?.includes('40/60') ? 40 : 50;
    const custodyMatch = involvementPercent >= (filters.custodyRange?.[0] ?? 0) && 
      involvementPercent <= (filters.custodyRange?.[1] ?? 100);
    
    return ageMatch && ethnicityMatch && languageMatch && lookingForMatch && custodyMatch;
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
