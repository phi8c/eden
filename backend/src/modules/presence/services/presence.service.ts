import { Injectable }
from '@nestjs/common';

import { RedisService }
from '../../../infrastructure/redis/redis.service';


@Injectable()

export class PresenceService{

 constructor(

   private readonly redis:
   RedisService,

 ){}

 private async ensurePresenceSet(
   userId:number,
 ){
   const key =
   `presence:${userId}`;

   const type =
   await this.redis.type(
      key
   );

   if(
     type !== 'none' &&
     type !== 'set'
   ){
      await this.redis.del(
        key
      );
   }

   return key;
 }

 async online(
   userId:number,
   socketId:string,
 ){
   const key =
   await this.ensurePresenceSet(
      userId
   );

   await this.redis.sadd(

      key,

      socketId,

   );

 }


 async offline(
   userId:number,
   socketId:string,
 ){
   const key =
   await this.ensurePresenceSet(
      userId
   );

   await this.redis.srem(

      key,

      socketId,

   );

 }


 async isOnline(
   userId:number,
 ){
   const key =
   await this.ensurePresenceSet(
      userId
   );

   const socketCount =

   await this.redis.scard(

      key

   );

   return socketCount > 0;

 }

}
