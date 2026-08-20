import { Injectable } from '@nestjs/common';

import type { CreateConversationDto } from '../dto/create-conversation.dto';

import { CreateConversationUseCase } from '../applications/create-conversation.usecase';
import { GetConversationsUseCase } from '../applications/get-conversations.usecase';

import { ConversationMemberRepository } from '../repositories/conversation-member.repository';

@Injectable()
export class ConversationService {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,

    private readonly getConversationsUseCase: GetConversationsUseCase,

    private readonly conversationMemberRepository: ConversationMemberRepository,
  ) {}

  async createConversation(
    userId: number,
    dto: CreateConversationDto,
  ) {
    return this.createConversationUseCase.execute(
      userId,
      dto,
    );
  }

  async getUserConversations(
    userId: number,
  ) {
    return this.getConversationsUseCase.execute(
      userId,
    );
  }

  async canJoinConversation(
    conversationId: number,
    userId: number,
  ): Promise<boolean> {
    return this.conversationMemberRepository.isMember(
      conversationId,
      userId,
    );
  }
}