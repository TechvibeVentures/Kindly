import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, CheckCircle, Clock, ThumbsUp, ThumbsDown, Send, Circle, Check, ChevronDown, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Topic } from '@/data/conversations';
import { useConversations, useSendMessage, useUpdateTopicCoverage } from '@/hooks/useConversations';
import { useCurrentUserProfile } from '@/hooks/useProfile';
import { mapDbConversationToFrontend } from '@/lib/utils/conversationMapper';

export default function Conversations() {
  const navigate = useNavigate();
  const { userRole, getTopicStatus } = useApp();
  const { t } = useLanguage();
  const { data: dbConversations = [], isLoading: conversationsLoading } = useConversations();
  const { data: currentUserProfile } = useCurrentUserProfile();
  const sendMessageMutation = useSendMessage();
  const updateTopicMutation = useUpdateTopicCoverage();

  const currentUserId = currentUserProfile?.user_id ?? null;
  const conversations = useMemo(() => {
    if (!currentUserId) return [];
    return (dbConversations as any[]).map((dbConv) =>
      mapDbConversationToFrontend(dbConv, dbConv.messages ?? [], dbConv.topics ?? [], currentUserId)
    );
  }, [dbConversations, currentUserId]);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showTopics, setShowTopics] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0].id);
    }
  }, [conversations, selectedConversation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interested':
        return <ThumbsUp className="w-4 h-4 text-primary" />;
      case 'declined':
        return <ThumbsDown className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTopicTranslation = (topic: Topic) => {
    const key = topic.translationKey as keyof typeof t;
    return t[key] || topic.name;
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const coveredByMeCount = selectedConv?.topics.filter(t => (selectedConv?.isCurrentUserSeeker ? t.seekerCovered : t.candidateCovered)).length ?? 0;
  const totalTopics = selectedConv?.topics.length ?? 0;

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConv || !selectedConversation) return;
    try {
      await sendMessageMutation.mutateAsync({ conversationId: selectedConversation, text: messageInput.trim() });
      setMessageInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getConversationPreview = (conv: typeof conversations[0]) => {
    if (conv.messages.length === 0) {
      return t.noMessagesYet;
    }
    const lastMsg = conv.messages[conv.messages.length - 1];
    return lastMsg.text.length > 40 ? lastMsg.text.slice(0, 40) + '...' : lastMsg.text;
  };

  if (conversationsLoading && conversations.length === 0) {
    return (
      <div className="pb-24 md:pb-0 flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-0">
      {/* Mobile Header (list view only) */}
      {!isMobileChatOpen && (
        <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-4 py-3 border-b border-border">
          <h1 className="text-xl font-bold">
            {userRole === 'seeker' ? t.conversations : t.requests}
          </h1>
          <p className="text-sm text-muted-foreground">
            {conversations.length} {userRole === 'seeker' ? t.ongoingChats : t.requests.toLowerCase()}
          </p>
        </div>
      )}

      {/* Desktop Split View */}
      <div className="hidden md:flex h-[calc(100vh-64px)]">
        {/* Conversations List */}
        <div className="w-80 lg:w-96 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold">
              {userRole === 'seeker' ? t.conversations : t.requests}
            </h1>
            <p className="text-sm text-muted-foreground">
              {conversations.length} {userRole === 'seeker' ? t.ongoingChats : t.requests.toLowerCase()}
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold mb-2">{t.noMatches}</h2>
                <p className="text-muted-foreground text-sm">
                  {userRole === 'seeker' ? t.discover : t.requests}
                </p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const isSelected = conversation.id === selectedConversation;
                const convCoveredCount = conversation.topics.filter(t => (conversation.isCurrentUserSeeker ? t.seekerCovered : t.candidateCovered)).length;
                const photoUrl = conversation.otherPhotoUrl ?? null;
                const displayName = userRole === 'seeker' ? conversation.otherDisplayName : conversation.seekerName;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 flex items-center gap-4 text-left border-b border-border/50 transition-colors ${
                      isSelected ? 'bg-primary/10' : 'hover:bg-secondary/50'
                    }`}
                  >
                    {photoUrl ? (
                      <img src={photoUrl} alt={displayName || ''} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">
                          {displayName}
                        </h3>
                        {getStatusIcon(conversation.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {getConversationPreview(conversation)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {convCoveredCount}/{conversation.topics.length} {t.topicsCovered}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {conversation.lastUpdated}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-border">
                <div className="p-4 flex items-center gap-4">
                  <button onClick={() => selectedConv.otherProfileId && navigate(`/candidate/${selectedConv.otherProfileId}`)}>
                    {selectedConv.otherPhotoUrl ? (
                      <img 
                        src={selectedConv.otherPhotoUrl} 
                        alt={selectedConv.otherDisplayName || ''}
                        className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                        <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                  <div className="flex-1">
                    <h2 className="font-semibold">{userRole === 'seeker' ? selectedConv.otherDisplayName : selectedConv.seekerName}</h2>
                  </div>
                  <button 
                    onClick={() => setShowTopics(!showTopics)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                    className="px-4 pb-4 border-t border-border bg-secondary/30"
                  >
                    <p className="text-sm text-muted-foreground py-3">{t.markTopicsAsCovered}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedConv.topics.map((topic) => {
                        const status = getTopicStatus(topic);
                        const isCoveredByMe = selectedConv.isCurrentUserSeeker ? topic.seekerCovered : topic.candidateCovered;
                        
                        return (
                          <button
                            key={topic.id}
                            onClick={() => {
                              const isSeeker = selectedConv.isCurrentUserSeeker ?? (userRole === 'seeker');
                              const currentCovered = isSeeker ? topic.seekerCovered : topic.candidateCovered;
                              updateTopicMutation.mutate({
                                conversationId: selectedConv.id,
                                topicId: topic.id,
                                isSeeker,
                                covered: !currentCovered,
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedConv.messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>{t.startConversation}</p>
                    </div>
                  </div>
                ) : (
                  selectedConv.messages.map((message) => {
                    const isMe = message.senderId === userRole;
                    
                    return (
                      <div 
                        key={message.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
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
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>{t.selectConversation}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile List / Chat View */}
      <div className={`md:hidden flex flex-col overflow-hidden min-h-0 ${isMobileChatOpen && selectedConv ? 'pt-16' : ''}`}>
        {isMobileChatOpen && selectedConv ? (
          <>
            {/* Mobile Chat Header */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-background border-b border-border">
              <div className="p-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsMobileChatOpen(false);
                    setShowTopics(false);
                  }}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-shrink-0">
                  {selectedConv.otherPhotoUrl ? (
                    <img
                      src={selectedConv.otherPhotoUrl}
                      alt={selectedConv.otherDisplayName || ''}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">
                    {userRole === 'seeker' ? selectedConv.otherDisplayName : selectedConv.seekerName}
                  </h2>
                </div>
                <button
                  onClick={() => setShowTopics(!showTopics)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>
                    {coveredByMeCount}/{totalTopics} {t.topicsCovered}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTopics ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {showTopics && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-3 bg-secondary/30"
              >
                <p className="text-sm text-muted-foreground py-2">{t.markTopicsAsCovered}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedConv.topics.map((topic) => {
                    const status = getTopicStatus(topic);
                    const isCoveredByMe = selectedConv.isCurrentUserSeeker ? topic.seekerCovered : topic.candidateCovered;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          const isSeeker = selectedConv.isCurrentUserSeeker ?? (userRole === 'seeker');
                          const currentCovered = isSeeker ? topic.seekerCovered : topic.candidateCovered;
                          updateTopicMutation.mutate({
                            conversationId: selectedConv.id,
                            topicId: topic.id,
                            isSeeker,
                            covered: !currentCovered,
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

            {/* Messages (scroll only here). Extra bottom padding prevents overlap with fixed input/nav. */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-32 space-y-3 scrollbar-hide">
              {selectedConv.messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>{t.startConversation}</p>
                </div>
              ) : (
                selectedConv.messages.map((message) => {
                  const isMe = message.senderId === userRole;
                  return (
                    <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          isMe ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? 'opacity-70' : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input (fixed so it doesn't move with scrolling) */}
            <div
              className="fixed left-1/2 -translate-x-1/2 w-full max-w-md p-4 border-t border-border bg-background z-60"
              style={{ bottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))' }}
            >
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
          </>
        ) : (
          // Mobile List
          <>
            {conversations.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold mb-2">{t.noMatches}</h2>
                <p className="text-muted-foreground mb-4">
                  {userRole === 'seeker' ? t.discover : t.requests}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {conversations.map((conversation, index) => {
                  const convCoveredCount = conversation.topics.filter(t => (conversation.isCurrentUserSeeker ? t.seekerCovered : t.candidateCovered)).length;
                  const photoUrl = conversation.otherPhotoUrl ?? null;
                  const displayName = userRole === 'seeker' ? conversation.otherDisplayName : conversation.seekerName;

                  return (
                    <motion.button
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setSelectedConversation(conversation.id);
                        setIsMobileChatOpen(true);
                        setShowTopics(false);
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="kindly-card w-full p-4 flex items-center gap-4 text-left"
                    >
                      {photoUrl ? (
                        <img src={photoUrl} alt={displayName || ''} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-7 h-7 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{displayName}</h3>
                          {getStatusIcon(conversation.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{getConversationPreview(conversation)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {convCoveredCount}/{conversation.topics.length} {t.topicsCovered}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground">{conversation.lastUpdated}</div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
