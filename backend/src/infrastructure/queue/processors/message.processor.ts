import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import {
  Job,
} from 'bullmq';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

import {
  EventEmitter2,
} from '@nestjs/event-emitter';

import {
  MessageDelivery,
} from '../../../modules/chat/messages/entities/message-delivery.entity';

import {
  ConversationMemberRepository,
} from '../../../modules/chat/conversations/repositories/conversation-member.repository';

import {
  ConversationRepository,
} from '../../../modules/chat/conversations/repositories/conversation.repository';

import {
  MessageCreatedPayload,
} from '../../../modules/chat/messages/events/message-created.event';

@Processor('message')
export class MessageProcessor extends WorkerHost {
  constructor(
    private readonly memberRepo: ConversationMemberRepository,

    @InjectRepository(MessageDelivery)
    private readonly deliveryRepo: Repository<MessageDelivery>,

    private readonly conversationRepo: ConversationRepository,

    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }



  private async processMessageCreated(
  payload: MessageCreatedPayload,
): Promise<void> {
  const members =
    await this.memberRepo.findByConversationId(
      payload.conversationId,
    );

  const deliveries = members.map((member) =>
    this.deliveryRepo.create({
      message_id: payload.id,
      user_id: member.user_id,
    }),
  );

  await this.deliveryRepo.save(
    deliveries,
  );

  await this.conversationRepo.updateLastMessage(
    payload.conversationId,
    payload.id,
  );

  this.eventEmitter.emit(
    'message.processed',
    payload,
  );
}

async process(
  job: Job<MessageCreatedPayload>,
): Promise<void> {
  switch (job.name) {
    case 'message.created':
      await this.processMessageCreated(
        job.data,
      );
      break;

    default:
      break;
  }
}

  private async handleMessageCreated(
    payload: MessageCreatedPayload,
  ): Promise<void> {
    const members =
      await this.memberRepo.findByConversationId(
        payload.conversationId,
      );

    const deliveries = members.map((member) =>
      this.deliveryRepo.create({
        message_id: payload.id,
        user_id: member.user_id,
      }),
    );

    await this.deliveryRepo.save(
      deliveries,
    );

    await this.conversationRepo.updateLastMessage(
      payload.conversationId,
      payload.id,
    );

    this.eventEmitter.emit(
      'message.processed',
      payload,
    );
  }
}