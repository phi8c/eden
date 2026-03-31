export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
  user_typing: (userId: string) => void;
}

export interface ClientToServerEvents {
  send_message: (data: SendMessagePayload) => void;
  join_room: (roomId: string) => void;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}