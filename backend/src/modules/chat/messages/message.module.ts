import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { Message } from './entities/message.entity';
import { MessageDelivery } from './entities/message-delivery.entity';

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

import { ConversationModule }
from '../conversations/conversation.module';

import { TopicModule }
from '../topics/topic.module';


/* USECASE */

import { SendMessageUseCase }
from './application/send-message.usecase';

import { GetMessagesUseCase }
from './application/get-messages.usecase';


import {QueueConfig} from '../../../infrastructure/queue/bull.module'



@Module({

 imports:[

   TypeOrmModule.forFeature([

      Message,

      MessageDelivery,

   ]),

   ConversationModule,

   TopicModule,

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

    SendMessageUseCase,

    GetMessagesUseCase,

 ],

 exports:[

    MessageService,

 ]

})

export class MessageModule {}