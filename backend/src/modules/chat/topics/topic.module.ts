import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Topic } from './entities/topic.entity';
import { TopicRepository } from './repositories/topic.repository';
import { TopicService } from './services/topic.service';
import { TopicController } from './controllers/topic.controller';

import { ConversationModule } from '../conversations/conversation.module';

import { CreateTopicUseCase } from './application/create-topic.usecase';

import { GetTopicsUseCase } from './application/get-topics.usecase';

import { CreateDefaultTopicUseCase } from './application/create-default-topic.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]),
    forwardRef(() => ConversationModule),
  ],
  providers: [
    TopicRepository,
    TopicService,
    CreateTopicUseCase,
    GetTopicsUseCase,
    CreateDefaultTopicUseCase,
  ],
  controllers: [TopicController],
  exports: [TopicRepository],
})
export class TopicModule {}
