import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ConversationMemberRepository } from '../../conversations/repositories/conversation-member.repository';
import { MessageReactionUpdatedEvent } from '../events/message-reaction-updated.event';
import { MessageReactionRepository } from '../repositories/message-reaction.repository';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class ToggleMessageReactionUseCase {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly reactionRepo: MessageReactionRepository,
    private readonly memberRepo: ConversationMemberRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(messageId: number, userId: number, reaction: string) {
    const message = await this.messageRepo.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const isMember = await this.memberRepo.isMember(
      message.conversation_id,
      userId,
    );

    if (!isMember) {
      throw new ForbiddenException('Access denied.');
    }

    const existing = await this.reactionRepo.findOne(
      messageId,
      userId,
      reaction,
    );

    if (existing) {
      await this.reactionRepo.remove(existing);
    } else {
      await this.reactionRepo.create({
        message_id: messageId,
        user_id: userId,
        reaction,
      });
    }

    const reactions = await this.reactionRepo.findByMessageId(messageId);
    const payload = {
      messageId,
      conversationId: message.conversation_id,
      topicId: message.topic_id,
      reactions: reactions.map((item) => ({
        id: Number(item.id),
        userId: Number(item.user_id),
        reaction: item.reaction,
        createdAt: item.created_at,
      })),
    };

    this.eventEmitter.emit(
      'message.reaction.updated',
      new MessageReactionUpdatedEvent(payload),
    );

    return payload;
  }
}
