import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, LessThanOrEqual, MoreThan, Repository } from 'typeorm';

import { MapMoment, MapMomentMedia } from '../entities';

@Injectable()
export class MapStoryMomentRepository {
  constructor(
    @InjectRepository(MapMoment)
    private readonly momentRepository: Repository<MapMoment>,

    @InjectRepository(MapMomentMedia)
    private readonly mediaRepository: Repository<MapMomentMedia>,
  ) {}

  createMoment(data: Partial<MapMoment>) {
    return this.momentRepository.create(data);
  }

  saveMoment(moment: MapMoment) {
    return this.momentRepository.save(moment);
  }

  createMedia(data: Partial<MapMomentMedia>) {
    return this.mediaRepository.create(data);
  }

  saveMedia(media: MapMomentMedia) {
    return this.mediaRepository.save(media);
  }

  findVisibleBySession(sessionId: number, now = new Date()) {
    return this.momentRepository.find({
      where: {
        session_id: sessionId,
        visible_until: MoreThan(now),
        deleted_at: IsNull(),
      },
      relations: ['media', 'media.storageAsset'],
      order: { created_at: 'DESC' },
    });
  }

  findExpiredVisibleMoments(now = new Date()) {
    return this.momentRepository.find({
      where: {
        visible_until: LessThanOrEqual(now),
        deleted_at: IsNull(),
      },
      relations: ['media', 'media.storageAsset'],
      take: 100,
    });
  }

  findSessionMomentsWithMedia(sessionId: number) {
    return this.momentRepository.find({
      where: {
        session_id: sessionId,
        deleted_at: IsNull(),
      },
      relations: ['media', 'media.storageAsset'],
    });
  }

  markDeleted(momentIds: number[], deletedAt = new Date()) {
    if (!momentIds.length) {
      return;
    }

    return this.momentRepository.update(
      {
        id: In(momentIds),
      },
      {
        deleted_at: deletedAt,
      },
    );
  }
}
