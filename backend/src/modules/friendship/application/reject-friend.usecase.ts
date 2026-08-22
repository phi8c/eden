import {
  BadRequestException,
  Injectable,
}
from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { FriendshipRepository }
from '../repositories/friendship.repository';

import { FriendshipStatus }
from '../enum/friendship-status.enum';
import { FriendshipUpdatedEvent }
from '../events/friendship-updated.event';

@Injectable()
export class RejectFriendUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

  private readonly eventEmitter:
  EventEmitter2,

 ){}

 async execute(userId:number, id:number){

   const friendship =
   await this.friendshipRepo
   .findById(id);

   if(!friendship){
      throw new BadRequestException(
        'Not found'
      );
   }

   if(friendship.requester_id===userId){
      throw new BadRequestException(
        'Cannot reject own request'
      );
   }

   if(friendship.user1_id!==userId && friendship.user2_id!==userId){
      throw new BadRequestException(
        'Access denied.'
      );
   }

   const updated = await
   this.friendshipRepo
   .updateStatus(

      id,

      FriendshipStatus.REJECTED,

   );

   if (updated) {
      this.eventEmitter.emit(
        'friendship.updated',
        new FriendshipUpdatedEvent({
          action: 'rejected',
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
