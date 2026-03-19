import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

/** All conversation topic IDs – always show these in the UI; coverage comes from conversation_topic_coverages. */
const CONVERSATION_TOPIC_IDS = ['parenting', 'conception', 'custody', 'living', 'legal', 'financial'] as const;

export type Conversation = Tables<'conversations'> & {
  candidate_profile?: any;
  user_profile?: any;
  last_message?: Tables<'messages'>;
  unread_count?: number;
};

export type Message = Tables<'messages'>;
export type ConversationTopic = Tables<'conversation_topic_coverages'>;

export type ConversationInsert = TablesInsert<'conversations'>;
export type MessageInsert = TablesInsert<'messages'>;
export type ConversationTopicUpdate = TablesUpdate<'conversation_topics'>;

/**
 * Get all conversations for the current user with messages and topics.
 * Schema uses user_a_id, user_b_id (auth user ids).
 */
export async function getUserConversations(): Promise<any[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user_a_id.eq.${session.user.id},user_b_id.eq.${session.user.id}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Fetch profiles for both participants (profiles.user_id = auth user id)
  const allUserIds = [...new Set((conversations || []).flatMap((c: any) => [c.user_a_id, c.user_b_id]))];
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .in('user_id', allUserIds);
  const profilesByUserId = new Map((profilesData || []).map((p: any) => [p.user_id, p]));

  const conversationsWithData = await Promise.all(
    (conversations || []).map(async (conv: any) => {
      const [messagesResult, coveragesResult] = await Promise.all([
        supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('conversation_topic_coverages')
          .select('*')
          .eq('conversation_id', conv.id)
      ]);

      const user_profile = profilesByUserId.get(conv.user_a_id) || null;
      const candidate_profile = profilesByUserId.get(conv.user_b_id) || null;

      // Map coverages to topic rows: seeker=user_a, candidate=user_b (always show all topics; coverage from DB)
      const coverages = coveragesResult.data || [];
      const topics = CONVERSATION_TOPIC_IDS.map((topicId) => ({
        topic_id: topicId,
        seeker_covered: coverages.some((c: any) => c.topic_id === topicId && c.user_id === conv.user_a_id),
        candidate_covered: coverages.some((c: any) => c.topic_id === topicId && c.user_id === conv.user_b_id),
      }));

      return {
        ...conv,
        user_id: conv.user_a_id,
        candidate_id: conv.user_b_id,
        user_profile,
        candidate_profile,
        messages: messagesResult.data || [],
        topics,
      };
    })
  );

  return conversationsWithData;
}

/**
 * Get a conversation by ID
 */
export async function getConversationById(conversationId: string): Promise<Conversation | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .or(`user_a_id.eq.${session.user.id},user_b_id.eq.${session.user.id}`)
    .maybeSingle();

  if (error || !data) return data as Conversation | null;

  const [userProfile, candidateProfile] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', data.user_a_id).maybeSingle(),
    supabase.from('profiles').select('*').eq('user_id', data.user_b_id).maybeSingle(),
  ]);

  return {
    ...data,
    user_id: data.user_a_id,
    candidate_id: data.user_b_id,
    user_profile: userProfile.data || null,
    candidate_profile: candidateProfile.data || null,
  } as Conversation;
}

/**
 * Get or create a conversation with a candidate.
 * candidateId is the profile id of the candidate; we resolve to auth user_id for the schema.
 */
export async function getOrCreateConversation(candidateId: string): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Resolve candidate profile id -> auth user_id
  const { data: candidateProfile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('id', candidateId)
    .maybeSingle();
  const candidateUserId = candidateProfile?.user_id;
  if (!candidateUserId) {
    throw new Error('Candidate profile not found');
  }

  const userA = session.user.id < candidateUserId ? session.user.id : candidateUserId;
  const userB = session.user.id < candidateUserId ? candidateUserId : session.user.id;

  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_a_id', userA)
    .eq('user_b_id', userB)
    .maybeSingle();

  let conversation: any;
  if (existing) {
    conversation = existing;
  } else {
    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({ user_a_id: userA, user_b_id: userB, status: 'active' })
      .select()
      .single();
    if (error) throw error;
    conversation = newConv;
  }

  const [messagesResult, coveragesResult] = await Promise.all([
    supabase.from('messages').select('*').eq('conversation_id', conversation.id).order('created_at', { ascending: true }),
    supabase.from('conversation_topic_coverages').select('*').eq('conversation_id', conversation.id),
  ]);

  const coverages = coveragesResult.data || [];
  const topics = CONVERSATION_TOPIC_IDS.map((topicId) => ({
    topic_id: topicId,
    seeker_covered: coverages.some((c: any) => c.topic_id === topicId && c.user_id === conversation.user_a_id),
    candidate_covered: coverages.some((c: any) => c.topic_id === topicId && c.user_id === conversation.user_b_id),
  }));

  const [userProfile, candProfile] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', conversation.user_a_id).maybeSingle(),
    supabase.from('profiles').select('*').eq('user_id', conversation.user_b_id).maybeSingle(),
  ]);

  return {
    ...conversation,
    user_id: conversation.user_a_id,
    candidate_id: conversation.user_b_id,
    user_profile: userProfile.data || null,
    candidate_profile: candProfile.data || null,
    messages: messagesResult.data || [],
    topics,
  };
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify user has access to this conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .or(`user_a_id.eq.${session.user.id},user_b_id.eq.${session.user.id}`)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Message[];
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, text: string): Promise<Message> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify user has access to this conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .or(`user_a_id.eq.${session.user.id},user_b_id.eq.${session.user.id}`)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: session.user.id,
      content: text.trim()
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

/**
 * Update conversation status
 */
export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'interested' | 'declined' | 'archived'
): Promise<Conversation> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('conversations')
    .update({ status })
    .eq('id', conversationId)
    .or(`user_a_id.eq.${session.user.id},user_b_id.eq.${session.user.id}`)
    .select('*')
    .single();

  if (error) throw error;
  return data as Conversation;
}

/**
 * Get conversation topics
 */
export async function getConversationTopics(conversationId: string): Promise<ConversationTopic[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify access
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, user_a_id, user_b_id')
    .eq('id', conversationId)
    .or(`user_a_id.eq.${session.user.id},user_b_id.eq.${session.user.id}`)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found or access denied');
  }

  const { data: coverages } = await supabase
    .from('conversation_topic_coverages')
    .select('*')
    .eq('conversation_id', conversationId);

  const cov = coverages || [];
  const topics = CONVERSATION_TOPIC_IDS.map((topicId) => ({
    topic_id: topicId,
    seeker_covered: cov.some((c: any) => c.topic_id === topicId && c.user_id === conversation.user_a_id),
    candidate_covered: cov.some((c: any) => c.topic_id === topicId && c.user_id === conversation.user_b_id),
  }));

  return topics as ConversationTopic[];
}

/**
 * Update topic coverage status
 */
export async function updateTopicCoverage(
  conversationId: string,
  topicId: string,
  isSeeker: boolean,
  covered: boolean
): Promise<ConversationTopic> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  // Verify access
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id, user_a_id, user_b_id')
    .eq('id', conversationId)
    .maybeSingle();

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const userId = isSeeker ? conversation.user_a_id : conversation.user_b_id;
  if (userId !== session.user.id) {
    throw new Error('Access denied');
  }

  if (covered) {
    const { data: inserted, error } = await supabase
      .from('conversation_topic_coverages')
      .upsert(
        { conversation_id: conversationId, topic_id: topicId, user_id: userId },
        { onConflict: 'conversation_id,topic_id,user_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return { topic_id: topicId, user_id: userId } as ConversationTopic;
  } else {
    const { error } = await supabase
      .from('conversation_topic_coverages')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('topic_id', topicId)
      .eq('user_id', userId);
    if (error) throw error;
    return { topic_id: topicId, user_id: userId } as ConversationTopic;
  }
}

