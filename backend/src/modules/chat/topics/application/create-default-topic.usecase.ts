import { Injectable }
from '@nestjs/common';

import { TopicRepository }
from '../repositories/topic.repository';

import { ConversationTopicRepository }
from '../../conversations/repositories/conversation-topic.repository';

@Injectable()

export class CreateDefaultTopicUseCase {

 constructor(

   private readonly topicRepo:
   TopicRepository,

   private readonly conversationTopicRepo:
   ConversationTopicRepository,

 ){}

 async execute(

   conversationId:number,

 ){

    const topic =

    await this.topicRepo.create({

        name:'General',

        created_at:
        new Date(),

    });


    await this.conversationTopicRepo.link(

       conversationId,

       topic.id,

    );

    return topic;

 }

}