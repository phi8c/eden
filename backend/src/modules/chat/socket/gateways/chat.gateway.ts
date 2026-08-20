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

import { SocketAuthService } from '../services/socket-auth.service';

import { SocketEvents } from '../constants/socket-events.constant';
import { SocketRoom } from '../constants/socket-room.constant';

import type {
  SocketUser,
} from '../services/socket-auth.service';

import type {
  MessageCreatedPayload,
} from '../../messages/events/message-created.event';

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

  public emitMessage(
    conversationId: number,
    payload: MessageCreatedPayload,
  ): void {
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
}
