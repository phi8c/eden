import { Module } from '@nestjs/common';

import { ChatGateway } from './gateways/chat.gateway';
import { SocketListener } from './listeners/socket.listener';

@Module({
  providers: [
    ChatGateway,
    SocketListener,
  ],
  exports: [
    ChatGateway, // để module khác có thể dùng nếu cần
  ],
})
export class SocketModule {}