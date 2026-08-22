import {
 Injectable,
 BadRequestException
}
from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { FriendshipRepository }
from '../repositories/friendship.repository';

import { SendFriendRequestDto }
from '../dto/send-friend-request.dto';

import { FriendshipStatus }
from '../enum/friendship-status.enum';
import { FriendshipUpdatedEvent }
from '../events/friendship-updated.event';

@Injectable()

export class SendRequestUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

  private readonly eventEmitter:
  EventEmitter2,

 ){}

 async execute(

   userId:number,

   dto:SendFriendRequestDto,

 ){

   const targetId =
   dto.targetUserId;


   if(
    userId===targetId
   ){

      throw new BadRequestException(
        'Cannot add yourself'
      );

   }


   const existed =

   await this.friendshipRepo
   .findByUsers(

      userId,

      targetId,

   );


   if(!existed){

      const friendship = await
      this.friendshipRepo
      .createfriendship({

         user1_id:
         Math.min(
           userId,
           targetId
         ),

         user2_id:
         Math.max(
           userId,
           targetId
         ),

         requester_id:
         userId,

         status:
         FriendshipStatus.PENDING,

         created_at:
         new Date(),

         updated_at:
         new Date(),

      });

      this.eventEmitter.emit(
        'friendship.updated',
        new FriendshipUpdatedEvent({
          action: 'request',
          friendship,
          actorId: userId,
          recipientUserIds: [targetId],
        }),
      );

      return friendship;

   }


   if(
     existed.status===1
   ){

      throw new BadRequestException(
        'Already friends'
      );

   }


   const friendship = await
   this.friendshipRepo
   .updateStatus(

      existed.id,

      FriendshipStatus.PENDING,

   );

   if (friendship) {
      this.eventEmitter.emit(
        'friendship.updated',
        new FriendshipUpdatedEvent({
          action: 'request',
          friendship,
          actorId: userId,
          recipientUserIds: [targetId],
        }),
      );
   }

   return friendship;

 }

}
