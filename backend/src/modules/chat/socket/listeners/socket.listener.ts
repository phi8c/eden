import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MessageCreatedEvent } from '../../messages/events/message-created.event';
import { ChatGateway } from '../gateways/chat.gateway';

@Injectable()
export class SocketListener {
  constructor(private readonly gateway: ChatGateway) {}

  @OnEvent('message.created')
  handleSocket(event: MessageCreatedEvent) {
    this.gateway.emitMessage(event.conversationId, {
      messageId: event.messageId,
      senderId: event.senderId,
    });
  }
}