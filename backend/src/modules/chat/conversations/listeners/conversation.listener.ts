import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import type {
  MessageCreatedPayload,
} from "../../messages/events/message-created.event";

import { Conversation } from "../entities/conversation.entity";

@Injectable()
export class ConversationListener {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
  ) {}

  @OnEvent("message.created")
  async handleUpdateConversation(
    payload: MessageCreatedPayload,
  ): Promise<void> {
    await this.conversationRepo.update(
      payload.conversationId,
      {
        last_message_id: payload.id,
        last_message_at: payload.createdAt,
      },
    );
  }
}