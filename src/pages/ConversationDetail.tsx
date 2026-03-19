import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, Circle, Check, ChevronDown, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Topic } from '@/data/conversations';
import { useConversation, useConversationMessages, useConversationTopics, useSendMessage, useUpdateTopicCoverage } from '@/hooks/useConversations';
import { useCurrentUserProfile } from '@/hooks/useProfile';
import { mapDbConversationToFrontend } from '@/lib/utils/conversationMapper';

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole, getTopicStatus } = useApp();
  const { t } = useLanguage();
  const [messageInput, setMessageInput] = useState('');
  const [showTopics, setShowTopics] = useState(false);
  
  const { data: dbConversation } = useConversation(id || null);
  const { data: messages = [] } = useConversationMessages(id || null);
  const { data: topics = [] } = useConversationTopics(id || null);
  const sendMessageMutation = useSendMessage();
  const updateTopicMutation = useUpdateTopicCoverage();
  const { data: currentUserProfile } = useCurrentUserProfile();
  
  // Get current user ID
  const currentUserId = currentUserProfile?.user_id || null;
  
  // Map database conversation to frontend format
  const conversation = dbConversation && currentUserId
    ? mapDbConversationToFrontend(dbConversation, (messages ?? []) as Parameters<typeof mapDbConversationToFrontend>[1], (topics ?? []) as Parameters<typeof mapDbConversationToFrontend>[2], currentUserId)
    : null;
  
  const displayName = conversation ? (userRole === 'seeker' ? conversation.otherDisplayName : conversation.seekerName) : null;
  const photoUrl = conversation?.otherPhotoUrl ?? null;

  const handleSend = async () => {
    if (!messageInput.trim() || !conversation || !id) return;
    try {
      await sendMessageMutation.mutateAsync({ conversationId: id, text: messageInput.trim() });
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getTopicTranslation = (topic: Topic) => {
    const key = topic.translationKey as keyof typeof t;
    return t[key] || topic.name;
  };

  const coveredByMeCount = conversation?.topics.filter(t => (userRole === 'seeker' ? t.seekerCovered : t.candidateCovered)).length ?? 0;
  const totalTopics = conversation?.topics.length ?? 0;

  if (!conversation) {
    return (
      <div className="p-4 text-center">
        <p>{t.conversationNotFound}</p>
        <button onClick={() => navigate(-1)} className="kindly-btn-primary mt-4">
          {t.goBack}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={displayName || ''}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={() => conversation?.otherProfileId && navigate(`/candidate/${conversation.otherProfileId}`)}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="font-semibold">
              {displayName}
            </h2>
          </div>
          <button 
            onClick={() => setShowTopics(!showTopics)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{coveredByMeCount}/{totalTopics} {t.topicsCovered}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showTopics ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Topics Panel */}
        {showTopics && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-3 border-t border-border bg-secondary/30"
          >
            <p className="text-sm text-muted-foreground py-2">{t.markTopicsAsCovered}</p>
            <div className="flex flex-wrap gap-2">
              {conversation.topics.map((topic) => {
                const status = getTopicStatus(topic);
                const isCoveredByMe = userRole === 'seeker' ? topic.seekerCovered : topic.candidateCovered;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      if (!id || !currentUserId || !dbConversation) return;
                      const dbConv = dbConversation as { user_id?: string };
                      const isSeeker = dbConv.user_id === currentUserId;
                      const currentCovered = isSeeker ? topic.seekerCovered : topic.candidateCovered;
                      updateTopicMutation.mutate({
                        conversationId: id,
                        topicId: topic.id,
                        isSeeker,
                        covered: !currentCovered
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                      status === 'covered' 
                        ? 'bg-success/20 text-success border border-success/30' 
                        : status === 'partial'
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-secondary text-muted-foreground border border-border'
                    }`}
                  >
                    {status === 'covered' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCoveredByMe ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                    {getTopicTranslation(topic)}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {conversation.messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t.startConversation}</p>
          </div>
        ) : (
          conversation.messages.map((message, index) => {
            const isMe = message.senderId === userRole;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  isMe 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary'
                }`}>
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    isMe ? 'opacity-70' : 'text-muted-foreground'
                  }`}>
                    {new Date(message.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.typeMessage}
            className="flex-1 px-4 py-3 rounded-xl bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-xl"
            onClick={handleSend}
            disabled={!messageInput.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
