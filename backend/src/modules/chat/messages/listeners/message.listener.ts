import { Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';

import { MessageCreatedEvent } from '../events/message-created.event';

import { MessageQueue } from '../../../../infrastructure/queue/queues/message.queue';

@Injectable()
export class MessageListener {
  constructor(
    private readonly messageQueue: MessageQueue,
  ) {}

  @OnEvent('message.created')
  async handleMessageCreated(
    event: MessageCreatedEvent,
  ): Promise<void> {
    await this.messageQueue.created(
      event,
    );
  }
}