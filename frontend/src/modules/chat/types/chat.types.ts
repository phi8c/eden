export type ConversationType = "private" | "group";

export interface ConversationMember {
  id: number;
  conversation_id: number;
  user_id: number;
  role: string | number;
  joined_at: string;
  last_read_message_id: number | null;
  user?: {
    id: number;
    username: string;
    email: string;
    status?: string;
  } | null;
  profile?: {
    userId: number;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
  } | null;
}

export interface Conversation {
  id: number;
  title: string | null;
  type: ConversationType;
  lastMessage: string | null;
  lastMessageAt: string | null;
  members: ConversationMember[];
}

export interface Topic {
  id: number;
  name: string;
  description?: string | null;
  created_by?: number | null;
  created_at?: string;
}

export interface Message {
  id: number;
  conversationId: number;
  topicId: number;
  senderId: number;
  content: string;
  type: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
}

export interface MessageAttachment {
  id: number;
  url: string;
  mimeType: string | null;
  createdAt: string;
}

export interface MessageReaction {
  id: number;
  userId: number;
  reaction: string | null;
  createdAt: string;
}

export interface MessageReactionUpdate {
  messageId: number;
  conversationId: number;
  topicId: number;
  reactions: MessageReaction[];
}

export interface SendMessagePayload {
  conversationId: number;
  topicId: number;
  content?: string;
  type?: number;
  metadata?: Record<string, unknown>;
  files?: File[];
}
