import {

 Controller,

 Get

}
from '@nestjs/common';

import {

 HealthCheck,

 HealthCheckService,

 TypeOrmHealthIndicator,

 MemoryHealthIndicator,

}
from '@nestjs/terminus';

import { RedisService }

from '../../../infrastructure/redis/redis.service';


@Controller(

 'health'

)   

export class HealthController{

 constructor(

   private readonly health:
   HealthCheckService,

   private readonly db:
   TypeOrmHealthIndicator,

   private readonly memory:
   MemoryHealthIndicator,

   private readonly redis:
   RedisService,

 ){}

 @Get()

 @HealthCheck()

 async check(){

   return await

   this.health.check([

      async()=>

      this.db.pingCheck(

         'mysql'

      ),

      async()=>

      this.memory.checkHeap(

         'memory',

         500 * 1024 * 1024,

      ),

      async()=>{

         await this.redis.set(

             'health',

             'ok',

             5,

         );

         return {

            redis:{

               status:'up'

            }

         };

      },

   ]);

 }

}