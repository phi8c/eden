import { Injectable }
from '@nestjs/common';

import { FriendshipRepository }
from '../repositories/friendship.repository';

@Injectable()
export class GetPendingUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

 ){}

 async execute(userId:number){

    return await

    this.friendshipRepo
    .findPendingRequests(

       userId

    );

 }

}