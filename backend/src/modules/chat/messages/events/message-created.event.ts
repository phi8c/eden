export interface MessageCreatedPayload {
  id: number;

  conversationId: number;

  topicId: number;

  senderId: number;

  content: string;

  type: number;

  metadata?: unknown;

  createdAt: Date;

  attachments?: {
    id: number;
    url: string;
    mimeType: string | null;
    createdAt: Date | string;
  }[];
}

export class MessageCreatedEvent {
  constructor(
    public readonly payload: MessageCreatedPayload,
  ) {}
}
