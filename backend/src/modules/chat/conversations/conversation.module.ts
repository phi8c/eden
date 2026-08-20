import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversation } from './entities/conversation.entity';
import { ConversationMember } from './entities/conversation-member.entity';

import { ConversationController } from './controllers/conversation.controller';
import { ConversationService } from './services/conversation.service';
import { ConversationRepository } from './repositories/conversation.repository';

import { ConversationMemberRepository } from './repositories/conversation-member.repository';

import { TopicModule } from '../topics/topic.module';
import { ConversationTopicRepository } from './repositories/conversation-topic.repository';


import { CreateConversationUseCase }
from './applications/create-conversation.usecase';

import { GetConversationsUseCase }
from './applications/get-conversations.usecase';

@Module({
 imports: [
  TypeOrmModule.forFeature([
    Conversation, 
    ConversationMember,
  ]),
  forwardRef(() => TopicModule),
],
  controllers: [ConversationController],
  providers: [
 ConversationService,

 ConversationRepository,

 ConversationMemberRepository,

 ConversationTopicRepository,


 CreateConversationUseCase,

 GetConversationsUseCase,
],
 exports: [
  ConversationService,

  ConversationRepository,

  ConversationMemberRepository,

  ConversationTopicRepository,
],
})
export class ConversationModule {}
