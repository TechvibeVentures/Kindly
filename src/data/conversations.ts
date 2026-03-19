export interface ChatMessage {
  id: string;
  senderId: 'seeker' | 'candidate';
  text: string;
  timestamp: string;
}

export interface Topic {
  id: string;
  name: string;
  translationKey: string;
  seekerCovered: boolean;
  candidateCovered: boolean;
}

export interface Conversation {
  id: string;
  candidateId: string;
  seekerName: string;
  messages: ChatMessage[];
  topics: Topic[];
  status: 'active' | 'interested' | 'declined';
  lastUpdated: string;
  /** Display name of the other person (for list/header) */
  otherDisplayName?: string;
  /** Photo URL of the other person */
  otherPhotoUrl?: string | null;
  /** Profile ID of the other person (for nav to /candidate/:id) */
  otherProfileId?: string;
  /** Whether the current user is user_a in this conversation (for topic coverage: seeker = user_a) */
  isCurrentUserSeeker?: boolean;
}

export const topicsList = [
  { id: 'parenting', name: 'Parenting Philosophy', translationKey: 'topicParenting' },
  { id: 'conception', name: 'Conception Method', translationKey: 'topicConception' },
  { id: 'custody', name: 'Weekly Rhythm & Custody', translationKey: 'topicCustody' },
  { id: 'living', name: 'Living Situation', translationKey: 'topicLiving' },
  { id: 'legal', name: 'Legal Setup', translationKey: 'topicLegal' },
  { id: 'financial', name: 'Financial Expectations', translationKey: 'topicFinancial' },
];

const createTopics = (): Topic[] => topicsList.map(t => ({
  id: t.id,
  name: t.name,
  translationKey: t.translationKey,
  seekerCovered: false,
  candidateCovered: false,
}));

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    candidateId: "1",
    seekerName: "Anna",
    messages: [
      { id: 'm1', senderId: 'seeker', text: 'Hi! Thanks for reaching out. I love your profile!', timestamp: '2024-01-15T10:00:00Z' },
      { id: 'm2', senderId: 'candidate', text: 'Thank you! I really liked what you wrote about your parenting philosophy.', timestamp: '2024-01-15T10:05:00Z' },
      { id: 'm3', senderId: 'seeker', text: 'That means a lot. What are your thoughts on the 50/50 custody arrangement?', timestamp: '2024-01-16T14:30:00Z' },
      { id: 'm4', senderId: 'candidate', text: 'I think it could work really well. I am very flexible with my work schedule.', timestamp: '2024-01-16T15:00:00Z' },
    ],
    topics: [
      { id: 'parenting', name: 'Parenting Philosophy', translationKey: 'topicParenting', seekerCovered: true, candidateCovered: true },
      { id: 'conception', name: 'Conception Method', translationKey: 'topicConception', seekerCovered: true, candidateCovered: false },
      { id: 'custody', name: 'Weekly Rhythm & Custody', translationKey: 'topicCustody', seekerCovered: false, candidateCovered: false },
      { id: 'living', name: 'Living Situation', translationKey: 'topicLiving', seekerCovered: false, candidateCovered: false },
      { id: 'legal', name: 'Legal Setup', translationKey: 'topicLegal', seekerCovered: false, candidateCovered: false },
      { id: 'financial', name: 'Financial Expectations', translationKey: 'topicFinancial', seekerCovered: false, candidateCovered: false },
    ],
    status: 'active',
    lastUpdated: "2024-01-16"
  },
  {
    id: "conv-2",
    candidateId: "5",
    seekerName: "Laura",
    messages: [
      { id: 'm1', senderId: 'candidate', text: 'Hello! Your profile really resonated with me.', timestamp: '2024-01-18T09:00:00Z' },
      { id: 'm2', senderId: 'seeker', text: 'Thanks so much! I was impressed by your background.', timestamp: '2024-01-18T09:30:00Z' },
    ],
    topics: createTopics(),
    status: 'active',
    lastUpdated: "2024-01-18"
  },
  {
    id: "conv-3",
    candidateId: "11",
    seekerName: "Sophie",
    messages: [
      { id: 'm1', senderId: 'seeker', text: 'Hi there! Would love to chat about co-parenting.', timestamp: '2024-01-20T11:00:00Z' },
    ],
    topics: createTopics(),
    status: 'active',
    lastUpdated: "2024-01-20"
  },
  {
    id: "conv-4",
    candidateId: "8",
    seekerName: "Maria",
    messages: [
      { id: 'm1', senderId: 'candidate', text: 'Hello Maria! I saw we have similar parenting values.', timestamp: '2024-01-12T08:00:00Z' },
      { id: 'm2', senderId: 'seeker', text: 'Yes! I noticed that too. Very exciting!', timestamp: '2024-01-12T08:15:00Z' },
      { id: 'm3', senderId: 'candidate', text: 'Shall we discuss the legal aspects first?', timestamp: '2024-01-12T09:00:00Z' },
    ],
    topics: [
      { id: 'parenting', name: 'Parenting Philosophy', translationKey: 'topicParenting', seekerCovered: true, candidateCovered: true },
      { id: 'conception', name: 'Conception Method', translationKey: 'topicConception', seekerCovered: true, candidateCovered: true },
      { id: 'custody', name: 'Weekly Rhythm & Custody', translationKey: 'topicCustody', seekerCovered: true, candidateCovered: true },
      { id: 'living', name: 'Living Situation', translationKey: 'topicLiving', seekerCovered: false, candidateCovered: false },
      { id: 'legal', name: 'Legal Setup', translationKey: 'topicLegal', seekerCovered: false, candidateCovered: false },
      { id: 'financial', name: 'Financial Expectations', translationKey: 'topicFinancial', seekerCovered: false, candidateCovered: false },
    ],
    status: 'interested',
    lastUpdated: "2024-01-12"
  },
  {
    id: "conv-5",
    candidateId: "15",
    seekerName: "Julia",
    messages: [],
    topics: createTopics(),
    status: 'active',
    lastUpdated: "2024-01-21"
  }
];
