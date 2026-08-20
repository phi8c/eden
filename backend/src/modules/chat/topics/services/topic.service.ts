import { Injectable }
from '@nestjs/common';

import { CreateTopicDto }
from '../dto/create-topic.dto';

import { CreateTopicUseCase }
from '../application/create-topic.usecase';

import { GetTopicsUseCase }
from '../application/get-topics.usecase';

import { CreateDefaultTopicUseCase }
from '../application/create-default-topic.usecase';

@Injectable()

export class TopicService {

 constructor(

   private readonly createTopicUseCase:
   CreateTopicUseCase,

   private readonly getTopicsUseCase:
   GetTopicsUseCase,

   private readonly createDefaultTopicUseCase:
   CreateDefaultTopicUseCase,

 ){}

 async createTopic(

   dto:CreateTopicDto,

   userId:number,

 ){

   return await

   this.createTopicUseCase.execute(

      dto,

      userId,

   );

 }


 async getTopics(

   conversationId:number,

 ){

   return await

   this.getTopicsUseCase.execute(

      conversationId,

   );

 }


 async createDefaultTopic(

   conversationId:number,

 ){

   return await

   this.createDefaultTopicUseCase.execute(

      conversationId,

   );

 }

}