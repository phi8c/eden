import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ConversationRepository } from '../../../conversations/repositories/conversation.repository';
import { CreateMapShareRequestDto } from '../dto';
import { MapShareSession } from '../entities';
import {
  MapSessionEndedEvent,
  MapShareAcceptedEvent,
  MapShareRejectedEvent,
  MapShareRequestedEvent,
  MapStoryEvents,
} from '../events';
import {
  MapShareSessionEndReason,
  MapShareSessionStatus,
} from '../enums';
import { MapStorySessionRepository } from '../repositories';
import { MapStoryLocationService } from './map-story-location.service';

@Injectable()
export class MapStorySessionService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly conversationRepository: ConversationRepository,
    private readonly sessionRepository: MapStorySessionRepository,
    private readonly locationService: MapStoryLocationService,
  ) {}

  async createShareRequest(
    userId: number,
    conversationId: number,
    dto: CreateMapShareRequestDto,
  ) {
    const conversation = await this.getPrivateConversationForUser(
      conversationId,
      userId,
    );
    const recipientId = this.getOtherMemberId(conversation.members, userId);
    const currentSession =
      await this.sessionRepository.findCurrentConversationSession(
        conversationId,
      );

    if (currentSession) {
      throw new BadRequestException(
        'Conversation already has a pending or active map session',
      );
    }

    const now = new Date();
    const session = await this.sessionRepository.saveSession(
      this.sessionRepository.createSession({
        conversation_id: conversationId,
        requested_by: userId,
        requested_to: recipientId,
        duration_minutes: dto.durationMinutes,
        status: MapShareSessionStatus.PENDING,
        requested_at: now,
      }),
    );

    const members = this.sessionRepository.createMembers([
      {
        session_id: session.id,
        user_id: userId,
      },
      {
        session_id: session.id,
        user_id: recipientId,
      },
    ]);

    await this.sessionRepository.saveMembers(members);

    this.eventEmitter.emit(
      MapStoryEvents.SHARE_REQUESTED,
      new MapShareRequestedEvent({
        sessionId: session.id,
        conversationId,
        requestedBy: userId,
        requestedTo: recipientId,
        durationMinutes: dto.durationMinutes,
      }),
    );

    return this.getSessionState(userId, session.id);
  }

  async acceptShareRequest(userId: number, sessionId: number) {
    const session = await this.getSessionForUser(sessionId, userId);

    if (session.requested_to !== userId) {
      throw new ForbiddenException('Only the request recipient can accept');
    }

    if (session.status !== MapShareSessionStatus.PENDING) {
      throw new BadRequestException('Map session is not pending');
    }

    session.status = MapShareSessionStatus.PENDING;
    session.accepted_at = new Date();

    await this.sessionRepository.saveSession(session);

    await this.locationService.tryStartSessionIfReady(
      session.id,
      new Date(),
    );

    this.eventEmitter.emit(
      MapStoryEvents.SHARE_ACCEPTED,
      new MapShareAcceptedEvent({
        sessionId: session.id,
        conversationId: session.conversation_id,
        acceptedBy: userId,
        requestedBy: session.requested_by,
      }),
    );

    return this.getSessionState(userId, session.id);
  }

  async rejectShareRequest(userId: number, sessionId: number) {
    const session = await this.getSessionForUser(sessionId, userId);

    if (session.requested_to !== userId) {
      throw new ForbiddenException('Only the request recipient can reject');
    }

    if (session.status !== MapShareSessionStatus.PENDING) {
      throw new BadRequestException('Map session is not pending');
    }

    session.status = MapShareSessionStatus.REJECTED;
    session.ended_at = new Date();
    session.ended_by = userId;
    session.end_reason = MapShareSessionEndReason.USER_STOPPED;

    await this.sessionRepository.saveSession(session);

    this.eventEmitter.emit(
      MapStoryEvents.SHARE_REJECTED,
      new MapShareRejectedEvent({
        sessionId: session.id,
        conversationId: session.conversation_id,
        rejectedBy: userId,
        requestedBy: session.requested_by,
      }),
    );

    return this.toSessionResponse(session);
  }

  async endSession(userId: number, sessionId: number) {
    const session = await this.getSessionForUser(sessionId, userId);

    if (
      session.status === MapShareSessionStatus.CANCELLED ||
      session.status === MapShareSessionStatus.EXPIRED ||
      session.status === MapShareSessionStatus.REJECTED
    ) {
      return this.toSessionResponse(session);
    }

    session.status = MapShareSessionStatus.CANCELLED;
    session.ended_at = new Date();
    session.ended_by = userId;
    session.end_reason = MapShareSessionEndReason.USER_STOPPED;

    await this.sessionRepository.saveSession(session);

    this.eventEmitter.emit(
      MapStoryEvents.SESSION_ENDED,
      new MapSessionEndedEvent({
        sessionId: session.id,
        conversationId: session.conversation_id,
        endedBy: userId,
        requestedBy: session.requested_by,
        requestedTo: session.requested_to,
      }),
    );

    return this.toSessionResponse(session);
  }

  async getConversationSession(userId: number, conversationId: number) {
    await this.getPrivateConversationForUser(conversationId, userId);

    const session =
      await this.sessionRepository.findCurrentConversationSession(
        conversationId,
      );

    return session ? this.toSessionResponse(session) : null;
  }

  async getSessionState(userId: number, sessionId: number) {
    const session = await this.getSessionForUser(sessionId, userId);

    return this.toSessionResponse(session);
  }

  private async getSessionForUser(
    sessionId: number,
    userId: number,
  ): Promise<MapShareSession> {
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

  private async getPrivateConversationForUser(
    conversationId: number,
    userId: number,
  ) {
    const conversation =
      await this.conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isMember = conversation.members.some(
      (member) => member.user_id === userId,
    );

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this conversation');
    }

    if (conversation.members.length !== 2) {
      throw new BadRequestException(
        'Map sharing is only available for one-to-one conversations',
      );
    }

    return conversation;
  }

  private getOtherMemberId(
    members: { user_id: number }[],
    userId: number,
  ): number {
    const recipient = members.find((member) => member.user_id !== userId);

    if (!recipient) {
      throw new BadRequestException('Map sharing requires another member');
    }

    return recipient.user_id;
  }

  private async toSessionResponse(session: MapShareSession) {
    const locations = await Promise.all(
      (session.members ?? []).map((member) =>
        this.locationService.getLatestLocation(session.id, member.user_id),
      ),
    );

    return {
      id: Number(session.id),
      conversationId: Number(session.conversation_id),
      requestedBy: Number(session.requested_by),
      requestedTo: Number(session.requested_to),
      durationMinutes: session.duration_minutes,
      status: session.status,
      requestedAt: session.requested_at,
      acceptedAt: session.accepted_at,
      startedAt: session.started_at,
      expiresAt: session.expires_at,
      endedAt: session.ended_at,
      endedBy: session.ended_by ? Number(session.ended_by) : null,
      endReason: session.end_reason,
      members: session.members?.map((member) => ({
        userId: Number(member.user_id),
        locationReady: Boolean(member.location_ready),
        joinedAt: member.joined_at,
        lastLocationAt: member.last_location_at,
      })) ?? [],
      locations: locations.filter(Boolean),
    };
  }
}
