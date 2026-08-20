export interface MessageCreatedPayload {
  id: number;

  conversationId: number;

  topicId: number;

  senderId: number;

  content: string;

  type: number;

  createdAt: Date;
}

export class MessageCreatedEvent {
  constructor(
    public readonly payload: MessageCreatedPayload,
  ) {}
}