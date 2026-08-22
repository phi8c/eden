import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Repository } from 'typeorm';

import { MapSessionMember, MapShareSession } from '../entities';
import { MapShareSessionStatus } from '../enums';

@Injectable()
export class MapStorySessionRepository {
  constructor(
    @InjectRepository(MapShareSession)
    private readonly sessionRepository: Repository<MapShareSession>,

    @InjectRepository(MapSessionMember)
    private readonly memberRepository: Repository<MapSessionMember>,
  ) {}

  createSession(data: Partial<MapShareSession>) {
    return this.sessionRepository.create(data);
  }

  saveSession(session: MapShareSession) {
    return this.sessionRepository.save(session);
  }

  createMembers(data: Partial<MapSessionMember>[]) {
    return this.memberRepository.create(data);
  }

  saveMembers(members: MapSessionMember[]) {
    return this.memberRepository.save(members);
  }

  findById(sessionId: number) {
    return this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['members'],
    });
  }

  findCurrentConversationSession(conversationId: number) {
    return this.sessionRepository.findOne({
      where: {
        conversation_id: conversationId,
        status: In([
          MapShareSessionStatus.PENDING,
          MapShareSessionStatus.ACTIVE,
        ]),
      },
      order: { requested_at: 'DESC' },
      relations: ['members'],
    });
  }

  findMember(sessionId: number, userId: number) {
    return this.memberRepository.findOne({
      where: {
        session_id: sessionId,
        user_id: userId,
      },
    });
  }

  findMembers(sessionId: number) {
    return this.memberRepository.find({
      where: {
        session_id: sessionId,
      },
    });
  }

  updateMemberLocationReady(
    sessionId: number,
    userId: number,
    lastLocationAt: Date,
  ) {
    return this.memberRepository.update(
      {
        session_id: sessionId,
        user_id: userId,
      },
      {
        location_ready: true,
        last_location_at: lastLocationAt,
        joined_at: lastLocationAt,
      },
    );
  }

  updateSession(
    sessionId: number,
    data: Partial<MapShareSession>,
  ) {
    return this.sessionRepository.update(sessionId, data);
  }

  findExpiredActiveSessions(now = new Date()) {
    return this.sessionRepository.find({
      where: {
        status: MapShareSessionStatus.ACTIVE,
        expires_at: LessThanOrEqual(now),
      },
      relations: ['members'],
      take: 50,
    });
  }
}
