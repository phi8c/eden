import { Injectable }
from '@nestjs/common';

import * as bcrypt
from 'bcrypt';

import { JwtService }
from '@nestjs/jwt';

import { Response }
from 'express';

import { LoginDto }
from '../dto/login.dto';

import { AuthRepository }
from '../repository/auth.repository';

import {

 InvalidCredentialsException

}
from '../exceptions/auth.exception';

const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()

export class LoginUseCase{

 constructor(

   private readonly authRepository:
   AuthRepository,

   private readonly jwtService:
   JwtService,

 ){}

 async execute(

   dto:LoginDto,

   res:Response,

 ){

   const user =

   await this.authRepository
   .findByEmail(

      dto.email

   );

   if(!user){

      throw new
      InvalidCredentialsException();

   }

   const valid =

   await bcrypt.compare(

      dto.password,

      user.password_hash,

   );

   if(!valid){

      throw new
      InvalidCredentialsException();

   }

   const payload={

      sub:user.id,

      email:user.email,

   };

   const accessToken=

   this.jwtService.sign(
      payload,
      {expiresIn:'15m'}
   );

   const refreshToken=

   this.jwtService.sign(
      payload,
      {expiresIn:'7d'}
   );

   res.cookie(

      'refresh_token',

      refreshToken,

      {

       httpOnly:true,

       secure:false,

       sameSite:'lax',

       path:'/',

       maxAge: REFRESH_TOKEN_MAX_AGE_MS,

      }

   );

   return {

      access_token:
      accessToken,

   };

 }

}
