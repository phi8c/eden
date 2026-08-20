import { Injectable }
from '@nestjs/common';

import * as bcrypt
from 'bcrypt';

import { AuthRepository }
from '../repository/auth.repository';

import { RegisterDto }
from '../dto/register.dto';

import {

 EmailAlreadyExistsException

}
from '../exceptions/auth.exception';

@Injectable()

export class RegisterUseCase{

 constructor(

  private readonly authRepository:
  AuthRepository,

 ){}

 async execute(
   dto:RegisterDto,
 ){

   const existing =

   await this.authRepository
   .findByEmail(

      dto.email

   );

   if(existing){

      throw new
      EmailAlreadyExistsException();

   }

   const hashed =

   await bcrypt.hash(

      dto.password,

      10,

   );

   return await

   this.authRepository
   .createUser({

      username:
      dto.username,

      email:
      dto.email,

      password_hash:
      hashed,

   });

 }

}