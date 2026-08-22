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
  async findById(id: number) {
    return this.messageRepo.findOne({
      where: { id },
      relations: ['reactions'],
    });
  }
  async findByTopicId(topicId: number) {
    return this.messageRepo.find({
      where: { topic_id: topicId },
      relations: ['attachments', 'reactions'],
      order: { created_at: 'ASC' },
    }); 
  }
  async findByConversationId(conversationId: number) {
    return this.messageRepo.find({
      where: { conversation_id: conversationId },
      relations: ['attachments', 'reactions'],
      order: { created_at: 'ASC' },
    });
  }
}
