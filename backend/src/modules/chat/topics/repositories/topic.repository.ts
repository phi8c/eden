import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Topic } from '../entities/topic.entity';

@Injectable()
export class TopicRepository {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {}

  async create(data: Partial<Topic>) {
    return this.topicRepo.save(data);
  }

  async createDefault(userId: number) {
    return this.topicRepo.save(
      this.topicRepo.create({
        name: 'default',
        description: 'default',
        created_by: userId,
        created_at: new Date(),
      }),
    );
  }


  async findByConversationId(
  conversationId: number,
) {
  return this.topicRepo
    .createQueryBuilder('topic')
    .innerJoin(
      'conversation_topics',
      'ct',
      'ct.topic_id = topic.id',
    )
    .where(
      'ct.conversation_id = :conversationId',
      { conversationId },
    )
    .getMany();
}

async findById(id: number) {
  return this.topicRepo.findOne({
    where: { id },
  });
}
}
