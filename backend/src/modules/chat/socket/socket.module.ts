import { Module } from '@nestjs/common';

import { AuthModule } from '../../auth/auth.module';

import { PresenceModule } from '../../presence/modules/presence.module';

import { ChatGateway } from './gateways/chat.gateway';

import { SocketListener } from './listeners/socket.listener';
import { MapStorySocketListener } from './listeners/map-story-socket.listener';
import { FriendshipSocketListener } from './listeners/friendship-socket.listener';

import { SocketAuthService } from './services/socket-auth.service';

import { SocketEmitterService } from './services/socket-emitter.service';


import { ConversationModule } from '../conversations/conversation.module';
import { MapStoryModule } from '../map/map-story';

@Module({

  imports: [

    AuthModule,

    PresenceModule, 

    ConversationModule,

    MapStoryModule

  ],

  providers: [

    ChatGateway,

    SocketListener,
    MapStorySocketListener,
    FriendshipSocketListener,

    SocketAuthService,
     SocketEmitterService,
   

  ],

  exports: [

    ChatGateway,

  ],

})

export class SocketModule {}
