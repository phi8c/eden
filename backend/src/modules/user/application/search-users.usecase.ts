import { Injectable }
from '@nestjs/common';

import { UserRepository }
from '../repositories/user.repository';

@Injectable()

export class SearchUsersUseCase{

 constructor(

  private readonly userRepository:
  UserRepository,

 ){}

 async execute(

   q:string,

 ){

   if(!q){

      return [];

   }

   return await

   this.userRepository
   .searchByEmail(

      q

   );

 }

}