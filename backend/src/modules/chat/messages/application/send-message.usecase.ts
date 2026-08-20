import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { MessageRepository } from '../repositories/message.repository';

import { SendMessageDto } from '../dto/send-message.dto';

import { MessageCreatedEvent } from '../events/message-created.event';

import { getErrorMessage } from '../../../../helper/error.helper';

import { RedisService } from '../../../../infrastructure/redis/redis.service';

import {
  toMessageResponseDto,
} from '../dto/message-response.dto';
import { ConversationRepository } from '../../conversations/repositories/conversation.repository';
import { ConversationMemberRepository } from '../../conversations/repositories/conversation-member.repository';

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly messageRepo: MessageRepository,

    private readonly eventEmitter: EventEmitter2,

    private readonly redis: RedisService,

    private readonly conversationRepo: ConversationRepository,

    private readonly memberRepo: ConversationMemberRepository,
  ) {}

  async execute(
    dto: SendMessageDto,

    userId: number,
  ) {
    try {
      if (!dto.content?.trim()) {
        throw new BadRequestException(
          'Content is required',
        );
      }

      const isMember =
        await this.memberRepo.isMember(
          dto.conversationId,
          userId,
        );

      if (!isMember) {
        throw new ForbiddenException(
          'Access denied.',
        );
      }

      const message =
        await this.messageRepo.create({
          conversation_id: dto.conversationId,

          topic_id: dto.topicId,

          sender_id: userId,

          content: dto.content.trim(),

          type: dto.type ?? 1,
        });

      await this.conversationRepo.updateLastMessage(
        dto.conversationId,
        message.id,
      );

      const members =
        await this.memberRepo.findByConversationId(
          dto.conversationId,
        );

      await Promise.all([
        this.redis.del(
          `messages:${dto.topicId}`,
        ),

        ...members.map((member) =>
          this.redis.del(
            `conversations:${member.user_id}`,
          ),
        ),
      ]);

      this.eventEmitter.emit(
        'message.created',

        new MessageCreatedEvent({
          id: message.id,

          conversationId:
            message.conversation_id,

          topicId:
            message.topic_id,

          senderId:
            message.sender_id,

          content:
            message.content,

          type:
            message.type,

          createdAt:
            message.created_at,
        }),
      );

      return toMessageResponseDto(
        message,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        getErrorMessage(error),
      );
    }
  }
}
