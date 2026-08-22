import { Injectable }
from '@nestjs/common';

import { ConversationRepository }
from '../repositories/conversation.repository';

import { RedisService }
from '../../../../infrastructure/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserProfile } from '../../../user/entities/user-profile.entity';
import { ConversationType } from '../enums/conversation-type.enum';


@Injectable()

export class GetConversationsUseCase{

 constructor(

   private readonly conversationRepository:
   ConversationRepository,

   private readonly redis:
   RedisService,

   @InjectRepository(UserProfile)
   private readonly profileRepository:
   Repository<UserProfile>,

 ){}

 async execute(

   userId:number,

 ){

   const cacheKey =

   `conversations:v2:${userId}`;


   const cached =

   await this.redis.get(

      cacheKey

   );


   if(cached){

      return cached;

   }


   const conversations =

   await this.conversationRepository
   .findByUserId(

      userId

   );

   const memberIds = [
      ...new Set(
         conversations.flatMap(
            (conversation) =>
               conversation.members.map(
                  (member) => Number(member.user_id),
               ),
         ),
      ),
   ];

   const profiles = memberIds.length
      ? await this.profileRepository.find({
           where: {
              userId: In(memberIds),
           },
        })
      : [];

   const profileByUserId = new Map(
      profiles.map((profile) => [
         Number(profile.userId),
         profile,
      ]),
   );


   const result =

   conversations.map(

      c=>({

         id:
         c.id,

         title:
         c.title,

         type:
         c.type === ConversationType.PRIVATE
            ? 'private'
            : 'group',

         lastMessage:

         c.last_message
         ?.content ||

         null,

         lastMessageAt:

         c.last_message_at,

         members:

         c.members.map((member) => {
            const profile = profileByUserId.get(
               Number(member.user_id),
            );

            return {
               id: member.id,
               conversation_id: member.conversation_id,
               user_id: member.user_id,
               role: member.role,
               joined_at: member.joined_at,
               last_read_message_id: member.last_read_message_id,
               user: member.user
                  ? {
                       id: member.user.id,
                       username: member.user.username,
                       email: member.user.email,
                       status: member.user.status,
                    }
                  : null,
               profile: profile
                  ? {
                       userId: profile.userId,
                       displayName: profile.displayName,
                       avatarUrl: profile.avatarUrl,
                       bio: profile.bio,
                    }
                  : null,
            };
         }),

      })

   );


   await this.redis.set(

      cacheKey,

      result,

      30,

   );


   return result;

 }

}
