import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationCreatedEvent } from '../../../../common/notifications';
import { MapStorySocketEvents } from '../../map/map-story/constants';
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
} from '../../map/map-story/events';
import { SocketEmitterService } from '../services/socket-emitter.service';

@Injectable()
export class MapStorySocketListener {
  constructor(private readonly socketEmitter: SocketEmitterService) {}

  @OnEvent(MapStoryEvents.SHARE_REQUESTED)
  handleShareRequested(event: MapShareRequestedEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.SHARE_REQUESTED, event.payload);
  }

  @OnEvent(MapStoryEvents.SHARE_ACCEPTED)
  handleShareAccepted(event: MapShareAcceptedEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.SHARE_ACCEPTED, event.payload);
  }

  @OnEvent(MapStoryEvents.SHARE_REJECTED)
  handleShareRejected(event: MapShareRejectedEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.SHARE_REJECTED, event.payload);
  }

  @OnEvent(MapStoryEvents.SESSION_STARTED)
  handleSessionStarted(event: MapSessionStartedEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.SESSION_STARTED, event.payload);
  }

  @OnEvent(MapStoryEvents.SESSION_ENDED)
  handleSessionEnded(event: MapSessionEndedEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.SESSION_ENDED, event.payload);
  }

  @OnEvent(MapStoryEvents.SESSION_EXPIRED)
  handleSessionExpired(event: MapSessionExpiredEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.SESSION_EXPIRED, event.payload);
  }

  @OnEvent(MapStoryEvents.MOMENT_CREATED)
  handleMomentCreated(event: MapMomentCreatedEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.MOMENT_CREATED, event.payload);
  }

  @OnEvent(MapStoryEvents.MOMENT_EXPIRED)
  handleMomentExpired(event: MapMomentExpiredEvent) {
    this.emit(event.payload.conversationId, MapStorySocketEvents.MOMENT_EXPIRED, event.payload);
  }

  @OnEvent('notification.created')
  handleNotificationCreated(event: NotificationCreatedEvent) {
    this.socketEmitter.emitToUser(
      event.payload.userId,
      MapStorySocketEvents.NOTIFICATION_CREATED,
      event.payload,
    );
  }

  private emit(
    conversationId: number,
    event: string,
    payload: unknown,
  ) {
    this.socketEmitter.emitToConversation(
      conversationId,
      event,
      payload,
    );
  }
}
