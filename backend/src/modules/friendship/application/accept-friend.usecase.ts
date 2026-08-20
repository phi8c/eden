import {
 Injectable,
 BadRequestException
}
from '@nestjs/common';

import { FriendshipRepository }
from '../repositories/friendship.repository';

import { FriendshipStatus }
from '../enum/friendship-status.enum';

@Injectable()
export class AcceptFriendUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

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

   return await
   this.friendshipRepo
   .updateStatus(

      id,

      FriendshipStatus.ACCEPTED,

   );

 }

}