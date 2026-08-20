import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}
  async create(data: Partial<Message>) {
    return this.messageRepo.save(data);
  }
  async findByTopicId(topicId: number) {
    return this.messageRepo.find({
      where: { topic_id: topicId },
      order: { created_at: 'ASC' },
    }); 
  }
  async findByConversationId(conversationId: number) {
    return this.messageRepo.find({
      where: { conversation_id: conversationId },
      order: { created_at: 'ASC' },
    });
  }
}
