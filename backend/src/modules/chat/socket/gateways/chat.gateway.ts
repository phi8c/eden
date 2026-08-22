import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import {
  Server,
  Socket,
} from 'socket.io';

import { PresenceService } from '../../../presence/services/presence.service';
import { ConversationService } from '../../conversations/services/conversation.service';
import { MapStorySocketEvents } from '../../map/map-story/constants';
import { MapStoryLocationService } from '../../map/map-story/services';
import type { MapLocationInput } from '../../map/map-story/types';

import { SocketAuthService } from '../services/socket-auth.service';

import { SocketEvents } from '../constants/socket-events.constant';
import { SocketRoom } from '../constants/socket-room.constant';

import type {
  SocketUser,
} from '../services/socket-auth.service';

import type {
  MessageCreatedPayload,
} from '../../messages/events/message-created.event';
import type {
  MessageReactionUpdatedPayload,
} from '../../messages/events/message-reaction-updated.event';

@WebSocketGateway({
  namespace: '/chat',
  cors: true,
})
@Injectable()
export class ChatGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  constructor(
    private readonly socketAuthService: SocketAuthService,

    private readonly presenceService: PresenceService,

    private readonly conversationService: ConversationService,

    private readonly mapStoryLocationService: MapStoryLocationService,
  ) {}

  @WebSocketServer()
  private server: Server;

  async handleConnection(
    client: Socket,
  ): Promise<void> {



      console.log(
    "[SOCKET CONNECT]",
    client.id,
  );

    try {
      const user =
        await this.socketAuthService.authenticate(
          client,
        );

      client.data.user = user;

      await this.presenceService.online(
        user.sub,
        client.id,
      );

      await client.join(
        SocketRoom.user(
          user.sub,
        ),
      );
    } catch {
      client.disconnect(true);
    }
  }

  async handleDisconnect(
    client: Socket,
  ): Promise<void> {
    const user =
      client.data.user as
        | SocketUser
        | undefined;

    if (!user) {
      return;
    }

    await this.presenceService.offline(
      user.sub,
      client.id,
    );
  }

  @SubscribeMessage(
    SocketEvents.CONVERSATION_JOIN,
  )
  async joinConversation(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    conversationId: number,
  ) {
    const user =
      client.data.user as SocketUser;

    const canJoin =
      await this.conversationService.canJoinConversation(
        Number(conversationId),
        user.sub,
      );

    if (!canJoin) {
      throw new ForbiddenException(
        'Access denied.',
      );
    }

    await client.join(
      SocketRoom.conversation(
        Number(conversationId),
      ),
    );

    console.log(
      '[SOCKET JOIN]',
      client.id,
      SocketRoom.conversation(
        Number(conversationId),
      ),
    );

    return {
      success: true,
      conversationId: Number(conversationId),
    };
  }

  @SubscribeMessage(
    SocketEvents.CONVERSATION_LEAVE,
  )
  async leaveConversation(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    conversationId: number,
  ): Promise<void> {
    await client.leave(
      SocketRoom.conversation(
        Number(conversationId),
      ),
    );
  }

  @SubscribeMessage(
    SocketEvents.MAP_LOCATION_UPDATE,
  )
  async updateMapLocation(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    payload: {
      sessionId: number;
      location: MapLocationInput;
    },
  ) {
    const user =
      client.data.user as SocketUser;

    const result =
      await this.mapStoryLocationService.updateLocation(
        user.sub,
        Number(payload.sessionId),
        payload.location,
      );

    this.server
      .to(
        SocketRoom.conversation(
          result.conversationId,
        ),
      )
      .emit(
        MapStorySocketEvents.LOCATION_UPDATED,
        result,
      );

    return {
      success: true,
      sessionId: result.sessionId,
    };
  }

  @SubscribeMessage(
    SocketEvents.MESSAGE_TYPING_START,
  )
  async startTyping(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    payload: {
      conversationId: number;
      topicId: number;
    },
  ) {
    await this.emitTyping(
      client,
      payload,
      true,
    );
  }

  @SubscribeMessage(
    SocketEvents.MESSAGE_TYPING_STOP,
  )
  async stopTyping(
    @ConnectedSocket()
    client: Socket,

    @MessageBody()
    payload: {
      conversationId: number;
      topicId: number;
    },
  ) {
    await this.emitTyping(
      client,
      payload,
      false,
    );
  }

  public emitMessage(
    conversationId: number,
    payload: MessageCreatedPayload,
  ): void {
    console.log(
      '[SOCKET EMIT message:new]',
      SocketRoom.conversation(
        conversationId,
      ),
      payload.id,
    );

    this.server
      .to(
        SocketRoom.conversation(
          conversationId,
        ),
      )
      .emit(
        SocketEvents.MESSAGE_NEW,
        payload,
      );
  }

  public emitMessageReaction(
    conversationId: number,
    payload: MessageReactionUpdatedPayload,
  ): void {
    this.server
      .to(
        SocketRoom.conversation(
          conversationId,
        ),
      )
      .emit(
        SocketEvents.MESSAGE_REACTION_UPDATED,
        payload,
      );
  }

  public emitToConversation(
    conversationId: number,
    event: string,
    payload: unknown,
  ): void {
    this.server
      .to(
        SocketRoom.conversation(
          conversationId,
        ),
      )
      .emit(
        event,
        payload,
      );
  }

  public emitToUser(
    userId: number,
    event: string,
    payload: unknown,
  ): void {
    this.server
      .to(
        SocketRoom.user(
          userId,
        ),
      )
      .emit(
        event,
        payload,
      );
  }

  private async emitTyping(
    client: Socket,
    payload: {
      conversationId: number;
      topicId: number;
    },
    typing: boolean,
  ) {
    const user =
      client.data.user as SocketUser;

    const conversationId =
      Number(payload.conversationId);
    const topicId =
      Number(payload.topicId);

    const canJoin =
      await this.conversationService.canJoinConversation(
        conversationId,
        user.sub,
      );

    if (!canJoin) {
      throw new ForbiddenException(
        'Access denied.',
      );
    }

    client
      .to(
        SocketRoom.conversation(
          conversationId,
        ),
      )
      .emit(
        SocketEvents.MESSAGE_TYPING_UPDATE,
        {
          conversationId,
          topicId,
          userId: user.sub,
          typing,
          updatedAt: new Date().toISOString(),
        },
      );
  }
}
