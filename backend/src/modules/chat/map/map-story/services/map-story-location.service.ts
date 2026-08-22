import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { RedisService } from '../../../../../infrastructure/redis/redis.service';
import { MapStoryRedisKeys } from '../constants';
import {
  MapSessionStartedEvent,
  MapStoryEvents,
} from '../events';
import { MapShareSessionStatus } from '../enums';
import { MapStorySessionRepository } from '../repositories';
import {
  MapLocationInput,
  MapLocationState,
  MapLocationUpdatePayload,
} from '../types';

@Injectable()
export class MapStoryLocationService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly redisService: RedisService,
    private readonly sessionRepository: MapStorySessionRepository,
  ) {}

  async updateLocation(
    userId: number,
    sessionId: number,
    input: MapLocationInput,
  ): Promise<MapLocationUpdatePayload> {
    this.assertValidLocation(input);

    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Map session not found');
    }

    const isSessionMember = session.members.some(
      (member) => member.user_id === userId,
    );

    if (!isSessionMember) {
      throw new ForbiddenException('You are not a member of this map session');
    }

    if (session.status !== MapShareSessionStatus.PENDING &&
      session.status !== MapShareSessionStatus.ACTIVE) {
      throw new BadRequestException('Map session is not accepting location updates');
    }

    const now = new Date();
    const location: MapLocationState = {
      userId,
      lat: input.lat,
      lng: input.lng,
      accuracy: input.accuracy ?? null,
      updatedAt: now.toISOString(),
    };

    await this.redisService.set(
      MapStoryRedisKeys.location(sessionId, userId),
      location,
      this.getLocationTtlSeconds(session.expires_at),
    );

    await this.sessionRepository.updateMemberLocationReady(
      sessionId,
      userId,
      now,
    );

    if (
      session.status === MapShareSessionStatus.PENDING &&
      session.accepted_at
    ) {
      await this.tryStartSessionIfReady(sessionId, now);
    }

    return {
      sessionId,
      conversationId: session.conversation_id,
      location,
    };
  }

  async getLatestLocation(
    sessionId: number,
    userId: number,
  ): Promise<MapLocationState | null> {
    return this.redisService.get<MapLocationState>(
      MapStoryRedisKeys.location(sessionId, userId),
    );
  }

  async tryStartSessionIfReady(
    sessionId: number,
    now: Date,
  ): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session || session.status !== MapShareSessionStatus.PENDING) {
      return;
    }

    const members = await this.sessionRepository.findMembers(sessionId);
    const everyoneReady =
      members.length === 2 &&
      members.every((member) => Boolean(member.location_ready));

    if (!everyoneReady) {
      return;
    }

    const expiresAt = new Date(
      now.getTime() + session.duration_minutes * 60 * 1000,
    );

    await this.sessionRepository.updateSession(sessionId, {
      status: MapShareSessionStatus.ACTIVE,
      started_at: now,
      expires_at: expiresAt,
    });

    this.eventEmitter.emit(
      MapStoryEvents.SESSION_STARTED,
      new MapSessionStartedEvent({
        sessionId,
        conversationId: session.conversation_id,
        requestedBy: session.requested_by,
        requestedTo: session.requested_to,
        startedAt: now,
        expiresAt,
      }),
    );
  }

  private assertValidLocation(input: MapLocationInput): void {
    if (!Number.isFinite(input.lat) || input.lat < -90 || input.lat > 90) {
      throw new BadRequestException('Invalid latitude');
    }

    if (!Number.isFinite(input.lng) || input.lng < -180 || input.lng > 180) {
      throw new BadRequestException('Invalid longitude');
    }

    if (
      input.accuracy !== undefined &&
      input.accuracy !== null &&
      (!Number.isFinite(input.accuracy) || input.accuracy < 0)
    ) {
      throw new BadRequestException('Invalid location accuracy');
    }
  }

  private getLocationTtlSeconds(expiresAt: Date | null): number {
    if (!expiresAt) {
      return 60 * 60 * 2;
    }

    const seconds = Math.ceil((expiresAt.getTime() - Date.now()) / 1000);

    return Math.max(seconds, 60);
  }
}
