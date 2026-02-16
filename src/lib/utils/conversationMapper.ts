/**
 * Utility to map database Conversation to frontend Conversation format
 */

import type { Conversation as DbConversation, ConversationTopic } from '@/lib/db/conversations';
import type { Conversation, Topic } from '@/data/conversations';

const topicTranslationMap: Record<string, string> = {
  'parenting': 'topicParenting',
  'conception': 'topicConception',
  'custody': 'topicCustody',
  'living': 'topicLiving',
  'legal': 'topicLegal',
  'financial': 'topicFinancial',
};

/**
 * Map database conversation to frontend format
 */
export function mapDbConversationToFrontend(
  dbConv: any,
  messages: any[],
  topics: any[],
  currentUserId: string
): Conversation {
  // Determine if current user is the seeker (user_id) or candidate
  const isSeeker = dbConv.user_id === currentUserId;
  const otherProfile = isSeeker ? dbConv.candidate_profile : dbConv.user_profile;
  const seekerProfile = dbConv.user_profile;
  const candidateProfile = dbConv.candidate_profile;

  const otherDisplayName = (otherProfile?.full_name || otherProfile?.first_name || otherProfile?.display_name || 'Unknown') as string;
  const otherPhotoUrl = otherProfile?.photo_url ?? null;
  const otherProfileId = (otherProfile?.id ?? (isSeeker ? dbConv.candidate_id : dbConv.user_id)) as string;

  return {
    id: dbConv.id,
    candidateId: dbConv.candidate_id,
    seekerName: (seekerProfile?.full_name || seekerProfile?.first_name || seekerProfile?.display_name || 'Unknown'),
    otherDisplayName,
    otherPhotoUrl,
    otherProfileId,
    messages: messages.map(msg => ({
      id: msg.id,
      senderId: msg.sender_id === currentUserId ? 'seeker' : 'candidate',
      text: (msg as any).content ?? (msg as any).text ?? '',
      timestamp: msg.created_at,
    })),
    topics: topics.map(topic => ({
      id: topic.topic_id,
      name: topic.topic_id.charAt(0).toUpperCase() + topic.topic_id.slice(1).replace(/_/g, ' '),
      translationKey: topicTranslationMap[topic.topic_id] || topic.topic_id,
      seekerCovered: topic.seeker_covered,
      candidateCovered: topic.candidate_covered,
    })),
    status: dbConv.status as 'active' | 'interested' | 'declined',
    lastUpdated: dbConv.last_message_at ? new Date(dbConv.last_message_at).toISOString().split('T')[0] : new Date(dbConv.created_at).toISOString().split('T')[0],
  };
}

