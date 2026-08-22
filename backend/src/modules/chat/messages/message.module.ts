import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { Message } from './entities/message.entity';
import { MessageAttachment } from './entities/message-attachment.entity';
import { MessageDelivery } from './entities/message-delivery.entity';
import { MessageReaction } from './entities/message-reaction.entity';

import { MessageController }
from './controllers/message.controller';

import { MessageService }
from './services/message.service';

import { MessageListener }
from './listeners/message.listener';

import { MessageConversationListener }
from './listeners/message-conversation.listener';

import { MessageRepository }
from './repositories/message.repository';
import { MessageAttachmentRepository }
from './repositories/message-attachment.repository';
import { MessageReactionRepository }
from './repositories/message-reaction.repository';

import { ConversationModule }
from '../conversations/conversation.module';

import { TopicModule }
from '../topics/topic.module';
import { StorageAssetsModule }
from '../../../common/storage';


/* USECASE */

import { SendMessageUseCase }
from './application/send-message.usecase';

import { GetMessagesUseCase }
from './application/get-messages.usecase';
import { ToggleMessageReactionUseCase }
from './application/toggle-message-reaction.usecase';


import {QueueConfig} from '../../../infrastructure/queue/bull.module'



@Module({

 imports:[

   TypeOrmModule.forFeature([

      Message,

      MessageAttachment,

      MessageDelivery,

      MessageReaction,

   ]),

   ConversationModule,

   TopicModule,

   StorageAssetsModule,

   QueueConfig,


   /* NEW */

   BullModule.registerQueue({

      name:

      'message',

   }),

 ],

 controllers:[

    MessageController,

 ],

 providers:[

    MessageService,

    MessageListener,

    MessageConversationListener,

    MessageRepository,

    MessageAttachmentRepository,

    MessageReactionRepository,

    SendMessageUseCase,

    GetMessagesUseCase,

    ToggleMessageReactionUseCase,

 ],

 exports:[

    MessageService,

 ]

})

export class MessageModule {}
