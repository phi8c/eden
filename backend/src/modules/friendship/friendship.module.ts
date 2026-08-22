import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Friendship } from './entities/friendship.entity';
import { FriendshipController } from './controllers/friendship.controller';
import { FriendshipService } from './services/friendship.service';
import { FriendshipRepository } from './repositories/friendship.repository';

import { SendRequestUseCase } from './application/send-request.usecase';
import { AcceptFriendUseCase } from './application/accept-friend.usecase';
import { RejectFriendUseCase } from './application/reject-friend.usecase';
import { UnfriendUseCase } from './application/unfriend.usecase';
import { GetFriendsUseCase } from './application/get-friends.usecase';

import { GetPendingUseCase } from './application/get-pending.usecase';
import { ConversationModule } from '../chat/conversations/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship]),
    ConversationModule,
  ],
  controllers: [FriendshipController],
  providers: [FriendshipService, FriendshipRepository, SendRequestUseCase,
AcceptFriendUseCase,
RejectFriendUseCase,
UnfriendUseCase,
GetFriendsUseCase,
GetPendingUseCase],
})
export class FriendshipModule {}
