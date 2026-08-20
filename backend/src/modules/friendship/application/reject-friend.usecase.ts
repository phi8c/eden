import { Injectable }
from '@nestjs/common';

import { FriendshipRepository }
from '../repositories/friendship.repository';

import { FriendshipStatus }
from '../enum/friendship-status.enum';

@Injectable()
export class RejectFriendUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

 ){}

 async execute(id:number){

   return await
   this.friendshipRepo
   .updateStatus(

      id,

      FriendshipStatus.REJECTED,

   );

 }

}