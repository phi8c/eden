import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { StoragePurpose, StorageService } from '../../../../../common/storage';
import { MapShareSessionStatus } from '../enums';
import {
  MapMomentCreatedEvent,
  MapStoryEvents,
} from '../events';
import {
  MapStoryLocationService,
} from './map-story-location.service';
import {
  MapStoryMomentRepository,
  MapStorySessionRepository,
} from '../repositories';

const MOMENT_VISIBLE_MINUTES = 30;
const LOCATION_STALE_SECONDS = 60;
const MAX_MOMENT_IMAGE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MOMENT_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

@Injectable()
export class MapStoryMomentService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly sessionRepository: MapStorySessionRepository,
    private readonly momentRepository: MapStoryMomentRepository,
    private readonly locationService: MapStoryLocationService,
    private readonly storageService: StorageService,
  ) {}

  async getMoments(userId: number, sessionId: number) {
    const session = await this.getSessionForMember(userId, sessionId);
    const moments = await this.momentRepository.findVisibleBySession(session.id);

    return Promise.all(moments.map(async (moment) => ({
      id: moment.id,
      sessionId: moment.session_id,
      conversationId: moment.conversation_id,
      userId: moment.user_id,
      latitude: Number(moment.latitude),
      longitude: Number(moment.longitude),
      accuracyMeters: moment.accuracy_meters
        ? Number(moment.accuracy_meters)
        : null,
      createdAt: moment.created_at,
      visibleUntil: moment.visible_until,
      media: await Promise.all(
        moment.media?.map(async (media) => ({
          id: media.id,
          storageAssetId: media.storage_asset_id,
          sortOrder: media.sort_order,
          mimeType: media.storageAsset?.mime_type,
          providerFileId: media.storageAsset?.provider_file_id,
          url: media.storageAsset
            ? await this.storageService.getPublicUrl(media.storageAsset)
            : null,
        })) ?? [],
      ),
    })));
  }

  async createMoment(
    userId: number,
    sessionId: number,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Moment image is required');
    }

    if (!ALLOWED_MOMENT_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        'Only jpeg, png, or webp images are allowed for map moments',
      );
    }

    if (file.size > MAX_MOMENT_IMAGE_BYTES) {
      throw new BadRequestException('Map moment image must be 50MB or smaller');
    }

    const session = await this.getSessionForMember(userId, sessionId);
    const now = new Date();

    if (session.status !== MapShareSessionStatus.ACTIVE) {
      throw new BadRequestException('Map session is not active');
    }

    if (!session.expires_at || session.expires_at <= now) {
      throw new BadRequestException('Map session has expired');
    }

    const location = await this.locationService.getLatestLocation(
      sessionId,
      userId,
    );

    if (!location) {
      throw new BadRequestException('Current realtime location is required');
    }

    const locationUpdatedAt = new Date(location.updatedAt);
    const staleMs = now.getTime() - locationUpdatedAt.getTime();

    if (
      Number.isNaN(locationUpdatedAt.getTime()) ||
      staleMs > LOCATION_STALE_SECONDS * 1000
    ) {
      throw new BadRequestException('Current realtime location is stale');
    }

    const visibleUntil = this.getVisibleUntil(now, session.expires_at);
    const upload = await this.storageService.uploadFile({
      ownerUserId: userId,
      purpose: StoragePurpose.MAP_MOMENT,
      buffer: file.buffer,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      expiresAt: visibleUntil,
      folderContext: {
        conversationId: session.conversation_id,
        sessionId: session.id,
      },
    });

    const moment = await this.momentRepository.saveMoment(
      this.momentRepository.createMoment({
        session_id: session.id,
        conversation_id: session.conversation_id,
        user_id: userId,
        latitude: location.lat.toFixed(7),
        longitude: location.lng.toFixed(7),
        accuracy_meters: location.accuracy?.toFixed(2) ?? null,
        created_at: now,
        visible_until: visibleUntil,
      }),
    );

    const media = await this.momentRepository.saveMedia(
      this.momentRepository.createMedia({
        moment_id: moment.id,
        storage_asset_id: upload.assetId,
        sort_order: 0,
        created_at: now,
      }),
    );

    this.eventEmitter.emit(
      MapStoryEvents.MOMENT_CREATED,
      new MapMomentCreatedEvent({
        momentId: moment.id,
        sessionId: moment.session_id,
        conversationId: moment.conversation_id,
        userId,
        recipientUserIds: session.members
          .filter((member) => member.user_id !== userId)
          .map((member) => member.user_id),
        visibleUntil: moment.visible_until,
        mediaUrl: upload.url,
      }),
    );

    return {
      id: moment.id,
      sessionId: moment.session_id,
      conversationId: moment.conversation_id,
      userId: moment.user_id,
      latitude: Number(moment.latitude),
      longitude: Number(moment.longitude),
      accuracyMeters: moment.accuracy_meters
        ? Number(moment.accuracy_meters)
        : null,
      createdAt: moment.created_at,
      visibleUntil: moment.visible_until,
      media: [
        {
          id: media.id,
          storageAssetId: upload.assetId,
          sortOrder: media.sort_order,
          url: upload.url,
          mimeType: upload.mimeType,
          providerFileId: upload.providerFileId,
        },
      ],
    };
  }

  private async getSessionForMember(userId: number, sessionId: number) {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Map session not found');
    }

    const isMember = session.members.some(
      (member) => member.user_id === userId,
    );

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this map session');
    }

    return session;
  }

  private getVisibleUntil(now: Date, sessionExpiresAt: Date): Date {
    const momentLimit = new Date(
      now.getTime() + MOMENT_VISIBLE_MINUTES * 60 * 1000,
    );

    return momentLimit < sessionExpiresAt ? momentLimit : sessionExpiresAt;
  }

}
