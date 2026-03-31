import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: true,
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  joinConversation(client: Socket, conversationId: number) {
    client.join(`conversation_${conversationId}`);
  }

  emitMessage(conversationId: number, payload: any) {
    this.server
      .to(`conversation_${conversationId}`)
      .emit('message:new', payload);
  }
}