import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from './entities';
import { NotificationRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationsModule {}
