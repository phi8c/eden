import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConversationMember } from '../entities/conversation-member.entity';

@Injectable()
export class ConversationMemberRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByConversationId(conversationId: number) {
    return this.dataSource
      .getRepository(ConversationMember)
      .find({
        where: { conversation_id: conversationId },
      });
  }
}