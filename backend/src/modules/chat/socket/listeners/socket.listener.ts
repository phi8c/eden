import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  MessageCreatedEvent,
} from '../../messages/events/message-created.event';

import { SocketEmitterService }
from '../services/socket-emitter.service';

@Injectable()
export class SocketListener {
  constructor(
    private readonly emitter:
      SocketEmitterService,
  ) {}

  @OnEvent(
    'message.created',
  )
  handleMessageCreated(
    event: MessageCreatedEvent,
  ): void {

    this.emitter.emitMessage(
      event.payload,
    );

  }
}