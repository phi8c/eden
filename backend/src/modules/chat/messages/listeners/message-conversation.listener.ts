import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MessageCreatedEvent } from '../events/message-created.event';
import { ConversationRepository } from '../../conversations/repositories/conversation.repository';

@Injectable()
export class MessageConversationListener {
  constructor(
    private readonly conversationRepo: ConversationRepository,
  ) {}

  @OnEvent('message.created')
  async handleUpdateConversation(event: MessageCreatedEvent) {
    await this.conversationRepo.updateLastMessage(
      event.conversationId,
      event.messageId,
    );
  }
}