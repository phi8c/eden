import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { FriendshipUpdatedEvent } from '../../../friendship/events/friendship-updated.event';
import { SocketEmitterService } from '../services/socket-emitter.service';

@Injectable()
export class FriendshipSocketListener {
  constructor(
    private readonly emitter: SocketEmitterService,
  ) {}

  @OnEvent('friendship.updated')
  handleFriendshipUpdated(event: FriendshipUpdatedEvent) {
    event.payload.recipientUserIds.forEach((userId) => {
      this.emitter.emitToUser(
        userId,
        'friendship:updated',
        event.payload,
      );
    });
  }
}
