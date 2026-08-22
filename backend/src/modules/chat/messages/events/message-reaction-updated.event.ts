import type { MessageReactionResponseDto } from '../dto/message-response.dto';

export interface MessageReactionUpdatedPayload {
  messageId: number;
  conversationId: number;
  topicId: number;
  reactions: MessageReactionResponseDto[];
}

export class MessageReactionUpdatedEvent {
  constructor(
    public readonly payload: MessageReactionUpdatedPayload,
  ) {}
}
