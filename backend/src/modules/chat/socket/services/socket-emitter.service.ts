import { Injectable } from '@nestjs/common';

import { ChatGateway } from '../gateways/chat.gateway';

import type {
  MessageCreatedPayload,
} from '../../messages/events/message-created.event';
import type {
  MessageReactionUpdatedPayload,
} from '../../messages/events/message-reaction-updated.event';

@Injectable()
export class SocketEmitterService {
  constructor(
    private readonly gateway: ChatGateway,
  ) {}

  public emitMessage(
    payload: MessageCreatedPayload,
  ): void {
    this.gateway.emitMessage(
      payload.conversationId,
      payload,
    );
  }

  public emitMessageReaction(
    payload: MessageReactionUpdatedPayload,
  ): void {
    this.gateway.emitMessageReaction(
      payload.conversationId,
      payload,
    );
  }

  public emitToConversation(
    conversationId: number,
    event: string,
    payload: unknown,
  ): void {
    this.gateway.emitToConversation(
      conversationId,
      event,
      payload,
    );
  }

  public emitToUser(
    userId: number,
    event: string,
    payload: unknown,
  ): void {
    this.gateway.emitToUser(
      userId,
      event,
      payload,
    );
  }
}
