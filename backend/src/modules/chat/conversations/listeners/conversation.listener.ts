import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageCreatedEvent } from '../../messages/events/message-created.event';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationListener {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
  ) {}

  @OnEvent('message.created')
  async handleUpdateConversation(event: MessageCreatedEvent) {
    await this.conversationRepo.update(event.conversationId, {
      last_message_id: event.messageId,
      last_message_at: new Date(),
    });
  }
}