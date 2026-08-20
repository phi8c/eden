export type ConversationType = "private" | "group";

export interface ConversationMember {
  id: number;
  conversation_id: number;
  user_id: number;
  role: string;
  joined_at: string;
  last_read_message_id: number | null;
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
  createdAt: string;
}

export interface SendMessagePayload {
  conversationId: number;
  topicId: number;
  content: string;
  type?: number;
}
