import {
  Injectable,
} from '@nestjs/common';

import {
  InjectQueue,
} from '@nestjs/bullmq';

import {
  Queue,
} from 'bullmq';

import {
  MessageCreatedEvent,
} from '../../../modules/chat/messages/events/message-created.event';

@Injectable()
export class MessageQueue {
  constructor(
    @InjectQueue('message')
    private readonly queue: Queue,
  ) {}

  async created(
    event: MessageCreatedEvent,
  ): Promise<void> {
    await this.queue.add(
      'message.created',
      event.payload,
      {
        removeOnComplete: 1000,

        removeOnFail: 5000,

        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }
}