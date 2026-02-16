import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { candidates, Candidate } from '@/data/candidates';
import { conversations, Conversation, ChatMessage, Topic } from '@/data/conversations';
import { useAuth } from '@/hooks/useAuth';
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
  mockConversations: Conversation[];
  updateConversationStatus: (id: string, status: Conversation['status']) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markTopicCovered: (conversationId: string, topicId: string) => void;
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
  const [mockConversations, setMockConversations] = useState<Conversation[]>(conversations);

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
        const mode = data?.app_mode;
        if (mode === 'seeker' || mode === 'candidate') {
          setUserRoleState(mode);
        }
        setCurrentUserPhotoUrl(data?.photo_url ?? null);
      });
  }, [user]);

  const setUserRole = useCallback(
    async (role: UserRole) => {
      setUserRoleState(role);
      if (!user) return;
      await supabase.from('profiles').update({ app_mode: role }).eq('user_id', user.id);
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

  const filteredCandidates = candidates.filter(candidate => {
    const ageMatch = candidate.age >= (filters.ageRange?.[0] ?? 25) && candidate.age <= (filters.ageRange?.[1] ?? 50);
    const ethnicityMatch = !filters.ethnicity?.length || 
      (candidate.ethnicity && filters.ethnicity.includes(candidate.ethnicity));
    const languageMatch = !filters.languages?.length || 
      filters.languages.some(l => candidate.languages.includes(l));
    const lookingForMatch = !filters.lookingFor?.length || 
      filters.lookingFor.some(term => candidate.lookingFor.toLowerCase().includes(term.toLowerCase()));
    const involvementPercent = candidate.involvement.includes('50/50') ? 50 :
      candidate.involvement.includes('60/40') ? 60 :
      candidate.involvement.includes('40/60') ? 40 : 50;
    const custodyMatch = involvementPercent >= (filters.custodyRange?.[0] ?? 0) && 
      involvementPercent <= (filters.custodyRange?.[1] ?? 100);
    
    return ageMatch && ethnicityMatch && languageMatch && lookingForMatch && custodyMatch;
  });

  const updateConversationStatus = (id: string, status: Conversation['status']) => {
    setMockConversations(convs => 
      convs.map(c => c.id === id ? { ...c, status } : c)
    );
  };

  const sendMessage = (conversationId: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: userRole,
      text,
      timestamp: new Date().toISOString(),
    };

    setMockConversations(convs =>
      convs.map(c => 
        c.id === conversationId 
          ? { 
              ...c, 
              messages: [...c.messages, newMessage],
              lastUpdated: new Date().toISOString().split('T')[0]
            } 
          : c
      )
    );
  };

  const markTopicCovered = (conversationId: string, topicId: string) => {
    setMockConversations(convs =>
      convs.map(c => {
        if (c.id !== conversationId) return c;
        
        return {
          ...c,
          topics: c.topics.map(t => {
            if (t.id !== topicId) return t;
            
            // Toggle the current user's covered status
            if (userRole === 'seeker') {
              return { ...t, seekerCovered: !t.seekerCovered };
            } else {
              return { ...t, candidateCovered: !t.candidateCovered };
            }
          })
        };
      })
    );
  };

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
      mockConversations,
      updateConversationStatus,
      sendMessage,
      markTopicCovered,
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
