import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageCreatedEvent } from '../events/message-created.event';
import { MessageDelivery } from '../entities/message-delivery.entity';

// ✅ FIX: đúng path
import { ConversationMemberRepository } from '../../conversations/repositories/conversation-member.repository';
import { ConversationRepository } from '../../conversations/repositories/conversation.repository';

@Injectable()
export class MessageListener {
  constructor(
    // ✅ FIX: dùng custom repo
    private readonly memberRepo: ConversationMemberRepository,
    private readonly conversationRepo: ConversationRepository,

    @InjectRepository(MessageDelivery)
    private readonly deliveryRepo: Repository<MessageDelivery>,
  ) {}

  @OnEvent('message.created')
  async handleCreateDelivery(event: MessageCreatedEvent) {
    const members = await this.memberRepo.findByConversationId(
      event.conversationId,
    );

    const deliveries = members.map((m) =>
      this.deliveryRepo.create({
        message_id: event.messageId,
        user_id: m.user_id,
      }),
    );

    await this.deliveryRepo.save(deliveries);
  }


   
}