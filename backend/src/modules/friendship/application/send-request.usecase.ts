import {
 Injectable,
 BadRequestException
}
from '@nestjs/common';

import { FriendshipRepository }
from '../repositories/friendship.repository';

import { SendFriendRequestDto }
from '../dto/send-friend-request.dto';

import { FriendshipStatus }
from '../enum/friendship-status.enum';

@Injectable()

export class SendRequestUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

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

      return await
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

   }


   if(
     existed.status===1
   ){

      throw new BadRequestException(
        'Already friends'
      );

   }


   return await
   this.friendshipRepo
   .updateStatus(

      existed.id,

      FriendshipStatus.PENDING,

   );

 }

}