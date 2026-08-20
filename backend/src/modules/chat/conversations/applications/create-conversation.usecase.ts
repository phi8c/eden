import { Injectable }
from '@nestjs/common';

import { CreateConversationDto }
from '../dto/create-conversation.dto';

import { ConversationRepository }
from '../repositories/conversation.repository';

import { TopicRepository }
from '../../topics/repositories/topic.repository';

import { ConversationTopicRepository }
from '../repositories/conversation-topic.repository';

import { ConversationType }
from '../enums/conversation-type.enum';

import { RedisService }
from '../../../../infrastructure/redis/redis.service';


@Injectable()

export class CreateConversationUseCase{

 constructor(

   private readonly conversationRepository:
   ConversationRepository,

   private readonly topicRepository:
   TopicRepository,

   private readonly conversationTopicRepository:
   ConversationTopicRepository,

   private readonly redis:
   RedisService,

 ){}

 async execute(

   userId:number,

   dto:CreateConversationDto,

 ){

   const otherUserId =

   dto.memberIds[0];


   const existed =

   await this.conversationRepository
   .findPrivateConversation(

      userId,

      otherUserId,

   );


   if(existed){

      return existed;

   }


   const conversation =

   await this.conversationRepository
   .createConversation({

      type:
      ConversationType.PRIVATE,

      created_by:
      userId,

      created_at:
      new Date(),

   });


   await this.conversationRepository
   .addMembers(

      conversation.id,

      [

        userId,

        otherUserId,

      ]

   );


   const topic =

   await this.topicRepository
   .createDefault(

      userId

   );


   await this.conversationTopicRepository
   .link(

      conversation.id,

      topic.id,

   );


   /* INVALIDATE CACHE */

   await this.redis.del(

      `conversations:${userId}`

   );


   await this.redis.del(

      `conversations:${otherUserId}`

   );


   return conversation;

 }

}