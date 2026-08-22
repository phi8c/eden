import type { Message } from '../entities/message.entity';

export interface MessageResponseDto {
  id: number;
  conversationId: number;
  topicId: number;
  senderId: number;
  content: string;
  type: number;
  metadata: unknown;
  createdAt: Date | string;
  attachments: MessageAttachmentResponseDto[];
  reactions: MessageReactionResponseDto[];
}

export interface MessageAttachmentResponseDto {
  id: number;
  url: string;
  mimeType: string | null;
  createdAt: Date | string;
}

export interface MessageReactionResponseDto {
  id: number;
  userId: number;
  reaction: string | null;
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
    metadata: message.metadata ?? null,
    createdAt,
    attachments:
      message.attachments?.map((attachment) => ({
        id: Number(attachment.id),
        url: attachment.file_url,
        mimeType: attachment.file_type,
        createdAt: attachment.created_at,
      })) ?? [],
    reactions:
      message.reactions?.map((reaction) => ({
        id: Number(reaction.id),
        userId: Number(reaction.user_id),
        reaction: reaction.reaction,
        createdAt: reaction.created_at,
      })) ?? [],
  };
}

export function toMessageResponseDtos(
  messages: RawMessage[],
): MessageResponseDto[] {
  return messages.map(toMessageResponseDto);
}
