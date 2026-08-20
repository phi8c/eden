import {
 Injectable,

 OnModuleDestroy

}
from '@nestjs/common';

import {
 ConfigService
}
from '@nestjs/config';

import Redis
from 'ioredis';


@Injectable()

export class RedisService

implements OnModuleDestroy{

 private client:
 Redis;


 constructor(

   private readonly config:
   ConfigService,

 ){

   this.client =

   new Redis({

      host:

      this.config.get(
       'REDIS_HOST'
      ),

      port:

      Number(

        this.config.get(
          'REDIS_PORT'
        )

      ),

      username:

      this.config.get(
        'REDIS_USERNAME'
      ),

      password:

      this.config.get(
        'REDIS_PASSWORD'
      ),

   });

 }


 /* SET */

 async set(

   key:string,

   value:any,

   ttl?:number,

 ){

   if(ttl){

      await this.client.set(

        key,

        JSON.stringify(
          value
        ),

        'EX',

        ttl,

      );

      return;

   }


   await this.client.set(

      key,

      JSON.stringify(
        value
      ),

   );

 }


 /* GET */

 async get<T>(

   key:string,

 ):Promise<T|null>{

   const value =

   await this.client.get(
      key
   );

   return value

   ? JSON.parse(value)

   : null;

 }


 /* DELETE */

 async del(

   key:string,

 ){

   await this.client.del(

      key

   );

 }


 /* EXISTS */

 async exists(

   key:string,

 ){

   return await

   this.client.exists(

      key

   );

 }


 async type(

   key:string,

 ){

   return this.client.type(

      key

   );

 }


 async sadd(

   key:string,

   value:string,

 ){

   return this.client.sadd(

      key,

      value,

   );

 }


 async srem(

   key:string,

   value:string,

 ){

   return this.client.srem(

      key,

      value,

   );

 }


 async scard(

   key:string,

 ){

   return this.client.scard(

      key

   );

 }


 /* CLOSE */

 async onModuleDestroy(){

   await this.client.quit();

 }

}
