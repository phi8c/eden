import {
 Injectable,
 UnauthorizedException
}
from '@nestjs/common';

import { JwtService }
from '@nestjs/jwt';

import { Request }
from 'express';

@Injectable()

export class RefreshTokenUseCase{

 constructor(

   private readonly jwtService:
   JwtService,

 ){}

 async execute(

   req:Request,

 ){

   const token =

   req.cookies
   ?.refresh_token;


   if(!token){

      throw new
      UnauthorizedException();

   }


   try{

      const payload =

      this.jwtService.verify(

         token

      );


      const accessToken =

      this.jwtService.sign({

          sub:
          payload.sub,

          email:
          payload.email,

      });


      return {

         access_token:
         accessToken,

      };

   }

   catch{

      throw new
      UnauthorizedException();

   }

 }

}