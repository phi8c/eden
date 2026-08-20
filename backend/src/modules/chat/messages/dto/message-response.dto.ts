import type { Message } from '../entities/message.entity';

export interface MessageResponseDto {
  id: number;
  conversationId: number;
  topicId: number;
  senderId: number;
  content: string;
  type: number;
  createdAt: Date | string;
}

type RawMessage = Partial<Message> & {
  conversationId?: number;
  topicId?: number;
  senderId?: number;
  createdAt?: Date | string;
};

export function toMessageResponseDto(
  message: RawMessage,
): MessageResponseDto {
  const createdAt =
    message.createdAt ??
    message.created_at ??
    new Date();

  return {
    id: Number(message.id),
    conversationId: Number(
      message.conversationId ??
        message.conversation_id,
    ),
    topicId: Number(
      message.topicId ?? message.topic_id,
    ),
    senderId: Number(
      message.senderId ?? message.sender_id,
    ),
    content: message.content ?? '',
    type: Number(message.type),
    createdAt,
  };
}

export function toMessageResponseDtos(
  messages: RawMessage[],
): MessageResponseDto[] {
  return messages.map(toMessageResponseDto);
}
