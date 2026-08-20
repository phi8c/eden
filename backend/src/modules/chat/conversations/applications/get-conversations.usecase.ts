import { Injectable }
from '@nestjs/common';

import { ConversationRepository }
from '../repositories/conversation.repository';

import { RedisService }
from '../../../../infrastructure/redis/redis.service';


@Injectable()

export class GetConversationsUseCase{

 constructor(

   private readonly conversationRepository:
   ConversationRepository,

   private readonly redis:
   RedisService,

 ){}

 async execute(

   userId:number,

 ){

   const cacheKey =

   `conversations:${userId}`;


   const cached =

   await this.redis.get(

      cacheKey

   );


   if(cached){

      return cached;

   }


   const conversations =

   await this.conversationRepository
   .findByUserId(

      userId

   );


   const result =

   conversations.map(

      c=>({

         id:
         c.id,

         title:
         c.title,

         type:
         c.type,

         lastMessage:

         c.last_message
         ?.content ||

         null,

         lastMessageAt:

         c.last_message_at,

         members:

         c.members,

      })

   );


   await this.redis.set(

      cacheKey,

      result,

      30,

   );


   return result;

 }

}