import {
 Injectable,
 BadRequestException
}
from '@nestjs/common';

import { TopicRepository }
from '../repositories/topic.repository';

import { ConversationTopicRepository }
from '../../conversations/repositories/conversation-topic.repository';

import { CreateTopicDto }
from '../dto/create-topic.dto';

@Injectable()

export class CreateTopicUseCase {

 constructor(

   private readonly topicRepo:
   TopicRepository,

   private readonly conversationTopicRepo:
   ConversationTopicRepository,

 ){}

 async execute(

   dto:CreateTopicDto,

   userId:number,

 ){

   if(

     !dto.name

   ){

      throw new BadRequestException(

        'Topic name is required'

      );

   }

   const topic =

   await this.topicRepo.create({

      name:
      dto.name,

      created_by:
      userId,

      created_at:
      new Date(),

   });


   await this.conversationTopicRepo.link(

      dto.conversationId,

      topic.id,

   );

   return topic;

 }

}