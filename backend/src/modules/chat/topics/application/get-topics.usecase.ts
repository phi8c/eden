import { Injectable }
from '@nestjs/common';

import { TopicRepository }
from '../repositories/topic.repository';

@Injectable()

export class GetTopicsUseCase {

 constructor(

   private readonly topicRepo:
   TopicRepository,

 ){}

 async execute(

   conversationId:number,

 ){

    return await

    this.topicRepo.findByConversationId(

        conversationId

    );

 }

}