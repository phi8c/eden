import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StorageService } from '../../../../../common/storage';
import { RedisService } from '../../../../../infrastructure/redis/redis.service';
import { MapStoryRedisKeys } from '../constants';
import {
  MapMomentExpiredEvent,
  MapSessionExpiredEvent,
  MapStoryEvents,
} from '../events';
import {
  MapShareSessionEndReason,
  MapShareSessionStatus,
} from '../enums';
import {
  MapStoryMomentRepository,
  MapStorySessionRepository,
} from '../repositories';

@Injectable()
export class MapStoryCleanupJob {
  private readonly logger = new Logger(MapStoryCleanupJob.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly redisService: RedisService,
    private readonly storageService: StorageService,
    private readonly sessionRepository: MapStorySessionRepository,
    private readonly momentRepository: MapStoryMomentRepository,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCleanup() {
    await this.expireSessions();
    await this.cleanupExpiredMoments();
    await this.cleanupStorageAssets();
  }

  private async expireSessions() {
    const now = new Date();
    const sessions =
      await this.sessionRepository.findExpiredActiveSessions(now);

    for (const session of sessions) {
      await this.sessionRepository.updateSession(session.id, {
        status: MapShareSessionStatus.EXPIRED,
        ended_at: now,
        end_reason: MapShareSessionEndReason.EXPIRED,
      });

      await Promise.all(
        session.members.map((member) =>
          this.redisService.del(
            MapStoryRedisKeys.location(session.id, member.user_id),
          ),
        ),
      );

      await this.deleteSessionMomentAssets(session.id, now);

      this.eventEmitter.emit(
        MapStoryEvents.SESSION_EXPIRED,
        new MapSessionExpiredEvent({
          sessionId: session.id,
          conversationId: session.conversation_id,
          requestedBy: session.requested_by,
          requestedTo: session.requested_to,
          expiredAt: now,
        }),
      );
    }
  }

  private async cleanupExpiredMoments() {
    const now = new Date();
    const moments = await this.momentRepository.findExpiredVisibleMoments(now);
    const momentIds = moments.map((moment) => moment.id);

    await this.momentRepository.markDeleted(momentIds, now);

    for (const moment of moments) {
      await this.deleteMomentAssets(moment);

      this.eventEmitter.emit(
        MapStoryEvents.MOMENT_EXPIRED,
        new MapMomentExpiredEvent({
          momentId: moment.id,
          sessionId: moment.session_id,
          conversationId: moment.conversation_id,
          userId: moment.user_id,
          expiredAt: now,
        }),
      );
    }
  }

  private async deleteSessionMomentAssets(
    sessionId: number,
    deletedAt: Date,
  ) {
    const moments =
      await this.momentRepository.findSessionMomentsWithMedia(sessionId);
    const momentIds = moments.map((moment) => moment.id);

    await this.momentRepository.markDeleted(momentIds, deletedAt);

    for (const moment of moments) {
      await this.deleteMomentAssets(moment);
    }
  }

  private async deleteMomentAssets(moment: {
    id: number;
    session_id?: number;
    conversation_id?: number;
    user_id?: number;
    media?: { storage_asset_id: number }[];
  }) {
    for (const media of moment.media ?? []) {
      try {
        await this.storageService.deleteAsset(media.storage_asset_id);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown storage delete error';

        this.logger.warn(
          `Failed to delete storage asset ${media.storage_asset_id} for moment ${moment.id}: ${message}`,
        );
      }
    }
  }

  private async cleanupStorageAssets() {
    try {
      await this.storageService.cleanupExpiredAssets();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown storage cleanup error';

      this.logger.warn(`Storage cleanup failed: ${message}`);
    }
  }
}
