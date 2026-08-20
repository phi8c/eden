import { Injectable }
from '@nestjs/common';

import { OnEvent }
from '@nestjs/event-emitter';

import { MessageCreatedEvent }
from '../events/message-created.event';

import { MessageQueue }
from '../../../../infrastructure/queue/queues/message.queue';

@Injectable()

export class MessageConversationListener {

 constructor(

   private readonly messageQueue:
   MessageQueue,

 ){}

 @OnEvent(

   'message.created'

 )

 async handleUpdateConversation(

   event:
   MessageCreatedEvent,

 ){

    await this.messageQueue.created(

       event

    );

 }

}