import { Injectable } from '@nestjs/common';

import { ChatGateway } from '../gateways/chat.gateway';

import type {
  MessageCreatedPayload,
} from '../../messages/events/message-created.event';

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
}