import {

 Injectable,

 NotFoundException

}
from '@nestjs/common';

import { UserRepository }
from '../repositories/user.repository';

import { UpdateProfileDto }
from '../dto/update-profile.dto';

import { RedisService }
from '../../../infrastructure/redis/redis.service';


@Injectable()

export class UpdateProfileUseCase{

 constructor(

   private readonly userRepository:
   UserRepository,

   private readonly redis:
   RedisService,

 ){}

 async execute(

   userId:number,

   dto:UpdateProfileDto,

 ){

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
   .updateProfile(

      userId,

      dto,

   );


   await this.redis.del(

      `profile:${userId}`

   );


   return {

      message:
      'Profile updated',

      profile,

   };

 }

}