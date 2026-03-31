import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';
import { SendMessageDto } from '../dto/send-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageCreatedEvent } from '../events/message-created.event';
import { TopicRepository } from '../../topics/repositories/topic.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly topicRepo: TopicRepository,
  ) {}

  async sendMessage(dto: SendMessageDto, userId: number) {
    try {
      if (!dto.content) {
        throw new BadRequestException('Content is required');
      }

      const message = await this.messageRepo.create({
        conversation_id: dto.conversationId,
        topic_id: dto.topicId,
        sender_id: userId,
        content: dto.content,
        type: dto.type || 1,
      });

      // ✅ FIX: event name
      this.eventEmitter.emit(
        'message.created',
        new MessageCreatedEvent(
          message.id,
          message.conversation_id,
          message.sender_id,
          message.content,
        ),
      );

      return message;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMessageByTopic(topicId: number) {
    try{
     const topic = await this.topicRepo.findById(topicId);
     if(!topicId) {
       throw new BadRequestException('Topic not found');
     }
     const message = await this.messageRepo.findByTopicId(topicId);
     return message;

    }
    catch(error) {
      throw new InternalServerErrorException(error.message);



    }
  }
}