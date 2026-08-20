import { Injectable }
from '@nestjs/common';

import { UpdateProfileDto }
from '../dto/update-profile.dto';

import { GetProfileUseCase }
from '../application/get-profile.usecase';

import { UpdateProfileUseCase }
from '../application/update-profile.usecase';

import { SearchUsersUseCase }
from '../application/search-users.usecase';


@Injectable()

export class UserService{

 constructor(

   private readonly getProfileUseCase:
   GetProfileUseCase,

   private readonly updateProfileUseCase:
   UpdateProfileUseCase,

   private readonly searchUsersUseCase:
   SearchUsersUseCase,

 ){}

 getProfile(
   userId:number,
 ){

   return this
   .getProfileUseCase
   .execute(

      userId

   );

 }


 updateProfile(

   userId:number,

   dto:UpdateProfileDto,

 ){

   return this
   .updateProfileUseCase
   .execute(

      userId,

      dto,

   );

 }


 searchUsers(
   q:string,
 ){

   return this
   .searchUsersUseCase
   .execute(q);

 }

}