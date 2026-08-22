import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageReaction } from '../entities/message-reaction.entity';

@Injectable()
export class MessageReactionRepository {
  constructor(
    @InjectRepository(MessageReaction)
    private readonly reactionRepo: Repository<MessageReaction>,
  ) {}

  async findByMessageId(messageId: number) {
    return this.reactionRepo.find({
      where: { message_id: messageId },
      order: { created_at: 'ASC' },
    });
  }

  async findOne(messageId: number, userId: number, reaction: string) {
    return this.reactionRepo.findOne({
      where: {
        message_id: messageId,
        user_id: userId,
        reaction,
      },
    });
  }

  async create(data: Partial<MessageReaction>) {
    return this.reactionRepo.save(data);
  }

  async remove(reaction: MessageReaction) {
    await this.reactionRepo.remove(reaction);
  }
}
