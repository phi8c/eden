import { Injectable }
from '@nestjs/common';

import { FriendshipRepository }
from '../repositories/friendship.repository';
import { ConversationService }
from '../../chat/conversations/services/conversation.service';
import { ConversationType }
from '../../chat/conversations/enums/conversation-type.enum';

@Injectable()
export class GetFriendsUseCase{

 constructor(

  private readonly friendshipRepo:
  FriendshipRepository,

  private readonly conversationService:
  ConversationService,

 ){}

 async execute(userId:number){

    const friendships = await

    this.friendshipRepo.findFriends(

        userId

    );

    await Promise.all(
      friendships.map((friendship) => {
        const otherUserId =
          Number(friendship.user1_id) === Number(userId)
            ? Number(friendship.user2_id)
            : Number(friendship.user1_id);

        return this.conversationService.createConversation(
          userId,
          {
            type: ConversationType.PRIVATE,
            memberIds: [otherUserId],
          },
        );
      }),
    );

    return friendships;

 }

}
