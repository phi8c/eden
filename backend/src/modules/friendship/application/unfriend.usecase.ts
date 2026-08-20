import { Injectable }
from '@nestjs/common';

import { FriendshipRepository }
from '../repositories/friendship.repository';

@Injectable()
export class UnfriendUseCase{

 constructor(

   private readonly friendshipRepo:
   FriendshipRepository,

 ){}

 async execute(id:number){

    return await

    this.friendshipRepo.delete(

       id

    );

 }

}