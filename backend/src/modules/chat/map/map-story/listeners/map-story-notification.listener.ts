import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import {
  NotificationCreatedEvent,
  NotificationRepository,
  NotificationType,
} from '../../../../../common/notifications';
import {
  MapMomentCreatedEvent,
  MapMomentExpiredEvent,
  MapSessionEndedEvent,
  MapSessionExpiredEvent,
  MapSessionStartedEvent,
  MapShareAcceptedEvent,
  MapShareRejectedEvent,
  MapShareRequestedEvent,
  MapStoryEvents,
} from '../events';

@Injectable()
export class MapStoryNotificationListener {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  @OnEvent(MapStoryEvents.SHARE_REQUESTED)
  async handleShareRequested(event: MapShareRequestedEvent) {
    await this.createNotification({
      userId: event.payload.requestedTo,
      actorId: event.payload.requestedBy,
      type: NotificationType.MAP_SHARE_REQUESTED,
      conversationId: event.payload.conversationId,
      data: {
        sessionId: event.payload.sessionId,
        durationMinutes: event.payload.durationMinutes,
      },
    });
  }

  @OnEvent(MapStoryEvents.SHARE_ACCEPTED)
  async handleShareAccepted(event: MapShareAcceptedEvent) {
    await this.createNotification({
      userId: event.payload.requestedBy,
      actorId: event.payload.acceptedBy,
      type: NotificationType.MAP_SHARE_ACCEPTED,
      conversationId: event.payload.conversationId,
      data: {
        sessionId: event.payload.sessionId,
      },
    });
  }

  @OnEvent(MapStoryEvents.SHARE_REJECTED)
  async handleShareRejected(event: MapShareRejectedEvent) {
    await this.createNotification({
      userId: event.payload.requestedBy,
      actorId: event.payload.rejectedBy,
      type: NotificationType.MAP_SHARE_REJECTED,
      conversationId: event.payload.conversationId,
      data: {
        sessionId: event.payload.sessionId,
      },
    });
  }

  @OnEvent(MapStoryEvents.SESSION_STARTED)
  async handleSessionStarted(event: MapSessionStartedEvent) {
    await Promise.all([
      this.createNotification({
        userId: event.payload.requestedBy,
        actorId: event.payload.requestedTo,
        type: NotificationType.MAP_SESSION_STARTED,
        conversationId: event.payload.conversationId,
        data: {
          sessionId: event.payload.sessionId,
          startedAt: event.payload.startedAt,
          expiresAt: event.payload.expiresAt,
        },
      }),
      this.createNotification({
        userId: event.payload.requestedTo,
        actorId: event.payload.requestedBy,
        type: NotificationType.MAP_SESSION_STARTED,
        conversationId: event.payload.conversationId,
        data: {
          sessionId: event.payload.sessionId,
          startedAt: event.payload.startedAt,
          expiresAt: event.payload.expiresAt,
        },
      }),
    ]);
  }

  @OnEvent(MapStoryEvents.SESSION_ENDED)
  async handleSessionEnded(event: MapSessionEndedEvent) {
    const targetUserId =
      event.payload.endedBy === event.payload.requestedBy
        ? event.payload.requestedTo
        : event.payload.requestedBy;

    await this.createNotification({
      userId: targetUserId,
      actorId: event.payload.endedBy,
      type: NotificationType.MAP_SESSION_ENDED,
      conversationId: event.payload.conversationId,
      data: {
        sessionId: event.payload.sessionId,
      },
    });
  }

  @OnEvent(MapStoryEvents.SESSION_EXPIRED)
  async handleSessionExpired(event: MapSessionExpiredEvent) {
    await Promise.all([
      this.createNotification({
        userId: event.payload.requestedBy,
        actorId: event.payload.requestedTo,
        type: NotificationType.MAP_SESSION_EXPIRED,
        conversationId: event.payload.conversationId,
        data: {
          sessionId: event.payload.sessionId,
          expiredAt: event.payload.expiredAt,
        },
      }),
      this.createNotification({
        userId: event.payload.requestedTo,
        actorId: event.payload.requestedBy,
        type: NotificationType.MAP_SESSION_EXPIRED,
        conversationId: event.payload.conversationId,
        data: {
          sessionId: event.payload.sessionId,
          expiredAt: event.payload.expiredAt,
        },
      }),
    ]);
  }

  @OnEvent(MapStoryEvents.MOMENT_CREATED)
  async handleMomentCreated(event: MapMomentCreatedEvent) {
    await Promise.all(
      event.payload.recipientUserIds.map((recipientUserId) =>
        this.createNotification({
          userId: recipientUserId,
          actorId: event.payload.userId,
          type: NotificationType.MAP_MOMENT_CREATED,
          conversationId: event.payload.conversationId,
          data: {
            sessionId: event.payload.sessionId,
            momentId: event.payload.momentId,
            visibleUntil: event.payload.visibleUntil,
            mediaUrl: event.payload.mediaUrl,
          },
        }),
      ),
    );
  }

  @OnEvent(MapStoryEvents.MOMENT_EXPIRED)
  async handleMomentExpired(event: MapMomentExpiredEvent) {
    await this.createNotification({
      userId: event.payload.userId,
      actorId: event.payload.userId,
      type: NotificationType.MAP_MOMENT_EXPIRED,
      conversationId: event.payload.conversationId,
      data: {
        sessionId: event.payload.sessionId,
        momentId: event.payload.momentId,
        expiredAt: event.payload.expiredAt,
      },
    });
  }

  private async createNotification(input: {
    userId: number;
    actorId: number;
    type: NotificationType;
    conversationId: number;
    data: Record<string, unknown>;
  }) {
    const notification = await this.notificationRepository.save(
      this.notificationRepository.create({
        user_id: input.userId,
        actor_id: input.actorId,
        type: input.type,
        conversation_id: input.conversationId,
        data: input.data,
        created_at: new Date(),
      }),
    );

    this.eventEmitter.emit(
      'notification.created',
      new NotificationCreatedEvent({
        id: notification.id,
        userId: notification.user_id,
        actorId: notification.actor_id,
        type: notification.type,
        conversationId: notification.conversation_id,
        data: notification.data,
        createdAt: notification.created_at,
      }),
    );

    return notification;
  }
}
