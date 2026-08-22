import {
 Injectable,
 BadRequestException
}
from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { FriendshipRepository }
from '../repositories/friendship.repository';

import { FriendshipStatus }
from '../enum/friendship-status.enum';
import { FriendshipUpdatedEvent }
from '../events/friendship-updated.event';
import { ConversationService }
from '../../chat/conversations/services/conversation.service';
import { ConversationType }
from '../../chat/conversations/enums/conversation-type.enum';

@Injectable()
export class AcceptFriendUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

  private readonly eventEmitter:
  EventEmitter2,

  private readonly conversationService:
  ConversationService,

 ){}

 async execute(
   userId:number,
   id:number,
 ){

   const friendship =

   await this.friendshipRepo
   .findById(id);

   if(!friendship){

      throw new BadRequestException(
        'Not found'
      );

   }

   if(
    friendship.requester_id===userId
   ){

      throw new BadRequestException(
        'Cannot accept own request'
      );

   }

   const otherUserId =
     Number(friendship.user1_id) === Number(userId)
       ? Number(friendship.user2_id)
       : Number(friendship.user1_id);

   if (friendship.status === FriendshipStatus.ACCEPTED) {
      await this.conversationService.createConversation(
        userId,
        {
          type: ConversationType.PRIVATE,
          memberIds: [otherUserId],
        },
      );

      return friendship;
   }

   const updated = await
   this.friendshipRepo
   .updateStatus(

      id,

      FriendshipStatus.ACCEPTED,

   );

   if (updated) {
      await this.conversationService.createConversation(
        userId,
        {
          type: ConversationType.PRIVATE,
          memberIds: [otherUserId],
        },
      );

      this.eventEmitter.emit(
        'friendship.updated',
        new FriendshipUpdatedEvent({
          action: 'accepted',
          friendship: updated,
          actorId: userId,
          recipientUserIds: [
            updated.user1_id,
            updated.user2_id,
          ],
        }),
      );
   }

   return updated;

 }

}
