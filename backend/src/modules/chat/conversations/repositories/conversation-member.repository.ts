import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
    ConversationMember,
    ConversationMemberRole,
} from '../entities/conversation-member.entity';



@Injectable()
export class ConversationMemberRepository {
  constructor(
    @InjectRepository(ConversationMember)
    private readonly repo: Repository<ConversationMember>,
  ) {}

  async addMembers(
    conversationId: number,
    userIds: number[],
  ) {
    const rows = userIds.map((userId) => ({
      conversation_id: conversationId,
      user_id: userId,
      role: ConversationMemberRole.MEMBER,
      joined_at: new Date(),
    }));

    return this.repo.save(rows);
  }

  async findByConversationId(
    conversationId: number,
  ) {
    return this.repo.find({
      where: {
        conversation_id: conversationId,
      },
    });
  }

  async isMember(
    conversationId: number,
    userId: number,
  ): Promise<boolean> {
    return this.repo.exists({
      where: {
        conversation_id: conversationId,
        user_id: userId,
      },
    });
  }

  async isMemberByTopicId(
    topicId: number,
    userId: number,
  ): Promise<boolean> {
    const count = await this.repo
      .createQueryBuilder('member')
      .innerJoin(
        'conversation_topics',
        'ct',
        'ct.conversation_id = member.conversation_id',
      )
      .where('ct.topic_id = :topicId', {
        topicId,
      })
      .andWhere('member.user_id = :userId', {
        userId,
      })
      .getCount();

    return count > 0;
  }

  async findMember(
    conversationId: number,
    userId: number,
  ) {
    return this.repo.findOne({
      where: {
        conversation_id: conversationId,
        user_id: userId,
      },
    });
  }

  async removeMember(
    conversationId: number,
    userId: number,
  ) {
    return this.repo.delete({
      conversation_id: conversationId,
      user_id: userId,
    });
  }
}
