import { IoAdapter }
from '@nestjs/platform-socket.io';

import { INestApplicationContext }
from '@nestjs/common';

import { ConfigService }
from '@nestjs/config';

import { createAdapter }
from '@socket.io/redis-adapter';

import Redis
from 'ioredis';


export class RedisIoAdapter

extends IoAdapter{

 private adapterConstructor:any;


 constructor(

   private app:
   INestApplicationContext,

 ){

   super(app);

 }


 async connect(){

   const config =

   this.app.get(
      ConfigService
   );


   const host =

   config.get<string>(
      'REDIS_HOST'
   );


   const port =

   Number(

      config.get<string>(
        'REDIS_PORT'
      )

   );


   const pubClient =

   new Redis({

      host,

      port,

      username:

      config.get<string>(
        'REDIS_USERNAME'
      ),

      password:

      config.get<string>(
        'REDIS_PASSWORD'
      ),

   });


   const subClient =

   pubClient.duplicate();


   this.adapterConstructor =

   createAdapter(

      pubClient,

      subClient,

   );

 }


 createIOServer(

   port:number,

   options?:any,

 ){

   const server =

   super.createIOServer(

      port,

      options,

   );


   server.adapter(

      this.adapterConstructor

   );


   return server;

 }

}
