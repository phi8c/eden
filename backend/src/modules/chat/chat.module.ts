import { Module } from '@nestjs/common';

import { MessageModule } from './messages/message.module';
import { ConversationModule } from './conversations/conversation.module';
import { SocketModule } from './socket/socket.module';
import {UserModule} from '../user/user.module'

@Module({
  imports: [
    MessageModule,
    ConversationModule,
    SocketModule,
    UserModule,
  ],
})
export class ChatModule {}