import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversation } from '../entities/conversation.entity';
import { ConversationMember } from '../entities/conversation-member.entity';


@Injectable()
export class ConversationRepository {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepo: Repository<Conversation>,

        @InjectRepository(ConversationMember)
        private readonly memberRepo: Repository<ConversationMember>,

    ){}

    async createConversation(data: Partial<Conversation>){
        const conversation = this.conversationRepo.create(data);
        return this.conversationRepo.save(conversation);
    }

    async addMembers(conversationId: number, members: number[]) {
        const rows = members.map(userId => ({
            conversation_id: conversationId,
            user_id: userId,
            role: 'member' as const,
            joined_at: new Date(),
        }));
        return this.memberRepo.save(rows);
    }
    async findUserConversations(userId: number) {
  const members = await this.memberRepo
    .createQueryBuilder('member')
    .leftJoinAndSelect('member.conversation', 'conversation') // 🔥 đúng
    .where('member.user_id = :userId', { userId })
    .getMany();

  return members.map((m) => m.conversation);
}


async updateLastMessage(
  conversationId: number,
  messageId: number,
) {
  await this.conversationRepo.update(conversationId, {
    last_message_id: messageId,
    last_message_at: new Date(),
  });
}



async findByUserId(userId: number) {
  return this.conversationRepo.find({
    relations: ['members', 'last_message'],
    where: {
      members: {
        user_id: userId,
      },
    },
    order: {
      last_message_at: 'DESC',
    },
  });
}
}




