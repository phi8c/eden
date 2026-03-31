import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversation } from './entities/conversation.entity';
import { ConversationMember } from './entities/conversation-member.entity';

import { ConversationController } from './controllers/conversation.controller';
import { ConversationService } from './services/conversation.service';
import { ConversationRepository } from './repositories/conversation.repository';

import { ConversationMemberRepository } from './repositories/conversation-member.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      ConversationMember,
    ]),
  ],
  controllers: [
    ConversationController,
  ],
  providers: [
    ConversationService,
    ConversationRepository,
    ConversationMemberRepository, // 🔥 thêm
  ],
  exports: [
    ConversationRepository,
    ConversationMemberRepository, // 🔥 thêm
  ],
})
export class ConversationModule {}