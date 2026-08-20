import {
 Injectable,

 NotFoundException

}
from '@nestjs/common';

import { UserRepository }
from '../repositories/user.repository';

import { RedisService }
from '../../../infrastructure/redis/redis.service';


@Injectable()

export class GetProfileUseCase{

 constructor(

   private readonly userRepository:
   UserRepository,

   private readonly redis:
   RedisService,

 ){}

 async execute(

   userId:number,

 ){

   const cacheKey =

   `profile:${userId}`;


   const cached =

   await this.redis.get(

      cacheKey

   );


   if(cached){

      return cached;

   }


   const user =

   await this.userRepository
   .findById(

      userId

   );


   if(!user){

      throw new NotFoundException(

         'User not found'

      );

   }


   const profile =

   await this.userRepository
   .findProfile(

      userId

   );


   const result = {

      user,

      profile,

   };


   await this.redis.set(

      cacheKey,

      result,

      300,

   );


   return result;

 }

}