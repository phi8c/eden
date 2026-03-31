import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities/message.entity';
import { MessageDelivery } from './entities/message-delivery.entity';

import { MessageService } from './services/message.service';
import { MessageListener } from './listeners/message.listener';
import { MessageRepository } from './repositories/message.repository';

import { ConversationModule } from '../conversations/conversation.module';
import { TopicModule } from '../topics/topic.module'; // 🔥 THÊM
import { MessageConversationListener } from './listeners/message-conversation.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      MessageDelivery,
    ]),
    ConversationModule,
    TopicModule,
  ],
  providers: [
    MessageService,
    MessageListener,
    MessageRepository,
    MessageConversationListener
  ],
  exports: [MessageService],
})
export class MessageModule {}