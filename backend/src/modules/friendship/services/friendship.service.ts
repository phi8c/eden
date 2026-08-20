import { Injectable }
from '@nestjs/common';

import { SendFriendRequestDto }
from '../dto/send-friend-request.dto';

import { SendRequestUseCase }
from '../application/send-request.usecase';

import { AcceptFriendUseCase }
from '../application/accept-friend.usecase';

import { RejectFriendUseCase }
from '../application/reject-friend.usecase';

import { UnfriendUseCase }
from '../application/unfriend.usecase';

import { GetFriendsUseCase }
from '../application/get-friends.usecase';

import { GetPendingUseCase }
from '../application/get-pending.usecase';


@Injectable()
export class FriendshipService{

 constructor(

  private readonly sendRequestUseCase:
  SendRequestUseCase,

  private readonly acceptFriendUseCase:
  AcceptFriendUseCase,

  private readonly rejectFriendUseCase:
  RejectFriendUseCase,

  private readonly unfriendUseCase:
  UnfriendUseCase,

  private readonly getFriendsUseCase:
  GetFriendsUseCase,

  private readonly getPendingUseCase:
  GetPendingUseCase,

 ){}

 sendRequest(
   userId:number,
   dto:SendFriendRequestDto,
 ){
   return this.sendRequestUseCase
   .execute(userId,dto);
 }

 accept(
   userId:number,
   id:number,
 ){
   return this.acceptFriendUseCase
   .execute(userId,id);
 }

 reject(
   userId:number,
   id:number,
 ){
   return this.rejectFriendUseCase
   .execute(id);
 }

 unfriend(
   userId:number,
   id:number,
 ){
   return this.unfriendUseCase
   .execute(id);
 }

 getFriends(userId:number){

   return this.getFriendsUseCase
   .execute(userId);

 }

 getPending(userId:number){

   return this.getPendingUseCase
   .execute(userId);

 }

}