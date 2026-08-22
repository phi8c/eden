import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsModule } from '../../../../common/notifications';
import { StorageAssetsModule } from '../../../../common/storage';
import { RedisModule } from '../../../../infrastructure/redis/redis.module';
import { ConversationModule } from '../../conversations/conversation.module';
import {
  MapStoryMomentController,
  MapStorySessionController,
} from './controllers';
import {
  MapMoment,
  MapMomentMedia,
  MapSessionMember,
  MapShareSession,
} from './entities';
import {
  MapStoryMomentRepository,
  MapStorySessionRepository,
} from './repositories';
import { MapStoryCleanupJob } from './jobs';
import { MapStoryNotificationListener } from './listeners';
import {
  MapStoryLocationService,
  MapStoryMomentService,
  MapStorySessionService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MapShareSession,
      MapSessionMember,
      MapMoment,
      MapMomentMedia,
    ]),
    ConversationModule,
    RedisModule,
    StorageAssetsModule,
    NotificationsModule,
  ],
  controllers: [MapStorySessionController, MapStoryMomentController],
  providers: [
    MapStorySessionRepository,
    MapStoryMomentRepository,
    MapStorySessionService,
    MapStoryLocationService,
    MapStoryMomentService,
    MapStoryNotificationListener,
    MapStoryCleanupJob,
  ],
  exports: [
    MapStorySessionRepository,
    MapStoryMomentRepository,
    MapStorySessionService,
    MapStoryLocationService,
    MapStoryMomentService,
  ],
})
export class MapStoryModule {}
