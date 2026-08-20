import { Injectable }
from '@nestjs/common';

import { FriendshipRepository }
from '../repositories/friendship.repository';

@Injectable()
export class GetFriendsUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

 ){}

 async execute(userId:number){

    return await

    this.friendshipRepo.findFriends(

        userId

    );

 }

}