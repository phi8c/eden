import {

 Injectable,

 BadRequestException,

 ForbiddenException,

 HttpException,

 InternalServerErrorException,

}
from '@nestjs/common';

import { MessageRepository }

from '../repositories/message.repository';

import { TopicRepository }

from '../../topics/repositories/topic.repository';


import { getErrorMessage } from '../../../../helper/error.helper'

import {RedisService} from '../../../../infrastructure/redis/redis.service'

import {
  toMessageResponseDtos,
} from '../dto/message-response.dto';
import { ConversationMemberRepository } from '../../conversations/repositories/conversation-member.repository';

@Injectable()

export class GetMessagesUseCase {

 constructor(

   private readonly messageRepo:
   MessageRepository,

   private readonly topicRepo:
   TopicRepository,

   private readonly redis:
   RedisService

   ,

   private readonly memberRepo:
   ConversationMemberRepository

 ){}

 async execute(

   topicId:number,

   userId:number

 ){

   try{

      const topic =

      await this.topicRepo.findById(
         topicId
      );

      if(!topic){

          throw new BadRequestException(

              'Topic not found'

          );

      }

      const canRead =

      await this.memberRepo
      .isMemberByTopicId(

         topicId,

         userId,

      );

      if(!canRead){

         throw new ForbiddenException(

            'Access denied.'

         );

      }

      const cacheKey =

`messages:${topicId}`;


const cached =

await this.redis.get(

   cacheKey

);


if(cached){

   return toMessageResponseDtos(
      cached as any[]
   );

}


const messages =

await this.messageRepo
.findByTopicId(

   topicId

);


await this.redis.set(

   cacheKey,

   toMessageResponseDtos(
      messages
   ),

   60,

);


return toMessageResponseDtos(
   messages
);

   }

   catch(error){

      if(error instanceof HttpException){

         throw error;

      }

      throw new InternalServerErrorException(getErrorMessage(error));

   }

 }

}
