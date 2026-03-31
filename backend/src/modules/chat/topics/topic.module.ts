import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Topic } from './entities/topic.entity';
import { TopicRepository } from './repositories/topic.repository';
import { TopicService } from './services/topic.service';
import { TopicController } from './controllers/topic.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]),
  ],
  providers: [
    TopicRepository,
    TopicService,
  ],
  controllers: [TopicController],
  exports: [
    TopicRepository,
  ],
})
export class TopicModule {}