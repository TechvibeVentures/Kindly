-- Conversations: 1:1 between two users (participants).
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'interested', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT conversations_ordered CHECK (user_a_id < user_b_id),
  UNIQUE (user_a_id, user_b_id)
);

CREATE INDEX conversations_user_a_id_idx ON public.conversations (user_a_id);
CREATE INDEX conversations_user_b_id_idx ON public.conversations (user_b_id);

-- Messages in a conversation.
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX messages_conversation_id_idx ON public.messages (conversation_id);

-- Which user has "covered" which topic in a conversation (for checklist UX).
CREATE TABLE public.conversation_topic_coverages (
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (conversation_id, topic_id, user_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_topic_coverages ENABLE ROW LEVEL SECURITY;

-- Participants can read/update their conversations.
CREATE POLICY "Participants can view conversation"
ON public.conversations FOR SELECT
USING (
  auth.uid() = user_a_id OR auth.uid() = user_b_id
);

CREATE POLICY "Participants can insert conversation"
ON public.conversations FOR INSERT
WITH CHECK (
  (auth.uid() = user_a_id OR auth.uid() = user_b_id) AND user_a_id < user_b_id
);

CREATE POLICY "Participants can update conversation"
ON public.conversations FOR UPDATE
USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Messages: participants can read and insert.
CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id AND (c.user_a_id = auth.uid() OR c.user_b_id = auth.uid())
  )
);

CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id AND (c.user_a_id = auth.uid() OR c.user_b_id = auth.uid())
  )
);

-- Topic coverages: participants can view and insert.
CREATE POLICY "Participants can view topic coverages"
ON public.conversation_topic_coverages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id AND (c.user_a_id = auth.uid() OR c.user_b_id = auth.uid())
  )
);

CREATE POLICY "Participants can set topic coverage"
ON public.conversation_topic_coverages FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id AND (c.user_a_id = auth.uid() OR c.user_b_id = auth.uid())
  )
);

CREATE POLICY "Participants can delete topic coverage"
ON public.conversation_topic_coverages FOR DELETE
USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id AND (c.user_a_id = auth.uid() OR c.user_b_id = auth.uid())
  )
);

-- Trigger to keep conversation.updated_at in sync.
CREATE OR REPLACE FUNCTION public.set_conversation_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations SET updated_at = NOW() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER messages_set_conversation_updated_at
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.set_conversation_updated_at();
