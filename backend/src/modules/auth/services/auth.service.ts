import { Injectable }
from '@nestjs/common';

import { Request, Response }
from 'express';

import { RegisterDto }
from '../dto/register.dto';

import { LoginDto }
from '../dto/login.dto';


import { RegisterUseCase }
from '../application/register.usecase';

import { LoginUseCase }
from '../application/login.usecase';

import { RefreshTokenUseCase }
from '../application/refresh-token.usecase';

import { LogoutUseCase }
from '../application/logout.usecase';


@Injectable()

export class AuthService{

 constructor(

   private readonly registerUseCase:
   RegisterUseCase,

   private readonly loginUseCase:
   LoginUseCase,

   private readonly refreshTokenUseCase:
   RefreshTokenUseCase,

   private readonly logoutUseCase:
   LogoutUseCase,

 ){}

 async register(
   dto:RegisterDto,
 ){

   return await

   this.registerUseCase
   .execute(dto);

 }


 async login(

   dto:LoginDto,

   res:Response,

 ){

   return await

   this.loginUseCase
   .execute(

      dto,

      res,

   );

 }


 async refresh(

   req:Request,

 ){

   return await

   this.refreshTokenUseCase
   .execute(

      req,

   );

 }


 logout(

   res:Response,

 ){

    return this
    .logoutUseCase
    .execute(

       res

    );

 }

}