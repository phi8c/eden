import 'reflect-metadata';

import { NestFactory }
from '@nestjs/core';

import { AppModule }
from './app.module';

import cookieParser
from 'cookie-parser';

import { RedisIoAdapter }
from './infrastructure/socket/socket.adapter';

import { ConfigService }
from '@nestjs/config';

import {

 ValidationPipe

}
from '@nestjs/common';

import {

 ThrottlerGuard

}
from '@nestjs/throttler';

import {

 Reflector

}
from '@nestjs/core';



async function bootstrap(){

 const app =

 await NestFactory.create(
   AppModule
 );

  const config =

 app.get(
   ConfigService
 );


 app.enableCors({

   origin:
    config.get<string>(
      'FE_PORT'
   ),


   credentials:true,

 });
 

 app.use(
   cookieParser()
 );



 

 app.useGlobalPipes(

 new ValidationPipe({

   whitelist:true,

   transform:true,

   transformOptions: {

     enableImplicitConversion: true,

   },

   forbidNonWhitelisted:true,

 }),

);







 /* NEW */

 const redisAdapter =

 new RedisIoAdapter(
    app
 );

 await redisAdapter.connect();

 app.useWebSocketAdapter(

    redisAdapter

 );


 await app.listen(

   process.env.PORT ??

   3000

 );

}

bootstrap();