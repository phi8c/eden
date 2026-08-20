import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversation } from '../entities/conversation.entity';


@Injectable()
export class ConversationTopicRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly repo: Repository<Conversation>,
  ) {}

  async link(conversationId: number, topicId: number) {
    return this.repo
      .createQueryBuilder()
      .relation(Conversation, 'topics')
      .of(conversationId)
      .add(topicId);
  }
}
