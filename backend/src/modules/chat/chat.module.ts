import { Module } from '@nestjs/common';

import { MessageModule } from './messages/message.module';
import { ConversationModule } from './conversations/conversation.module';
import { SocketModule } from './socket/socket.module';
import { UserModule } from '../user/user.module';
import { MapStoryModule } from './map/map-story';

@Module({
  imports: [
    MessageModule,
    ConversationModule,
    SocketModule,
    UserModule,
    MapStoryModule,
  ],
})
export class ChatModule {}
