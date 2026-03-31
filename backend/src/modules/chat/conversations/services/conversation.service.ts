import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../repositories/conversation.repository';
import { CreateConversationDto } from '../dto/create-conversation.dto';

@Injectable()
export class ConversationService {

  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async createConversation(userId: number, dto: CreateConversationDto) {

    const conversation = await this.conversationRepository.createConversation({
      type: dto.type,
      title: dto.title,
      created_by: userId,
      created_at: new Date(),
    });

    const members = [...dto.members, userId];

    await this.conversationRepository.addMembers(
      conversation.id,
      members,
    );

    return conversation;
  }

  async getUserConversations(userId: number) {
  const conversations = await this.conversationRepository.findByUserId(userId);

  return conversations.map((c) => ({
    id: c.id,
    title: c.title,
    type: c.type,

    lastMessage: c.last_message?.content || null, // 🔥 FIX
    lastMessageAt: c.last_message_at,
  }));
}

}