import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './modules/chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FriendshipModule } from './modules/friendship/friendship.module';

import {

 HealthModule

}

from './modules/health/health.module';


import {

 AppLogger

}
from './infrastructure/logger/logger.module';


import { AppCache } from './infrastructure/cache/cache.module';



import {

 StorageModule

}

from './infrastructure/storage/storage.module';


import { ConfigService }
from '@nestjs/config';

import { RedisModule }
from './infrastructure/redis/redis.module';

import { QueueConfig }
from './infrastructure/queue/bull.module';

import { AppService }
from './app.service';

import { APP_GUARD }
from '@nestjs/core';

import {

 ThrottlerGuard
}
from '@nestjs/throttler';


import {

 ThrottlerModule

}
from '@nestjs/throttler';

@Module({

 imports:[

   ConfigModule.forRoot({

      isGlobal:true,
      

   }),

   StorageModule,

   ThrottlerModule.forRoot([

 {

   ttl:60000,

   limit:100,

 },

]),

   TypeOrmModule.forRootAsync({

 inject:[

   ConfigService,
   // AppLogger,
   // AppCache,

 ],

 useFactory:(

   config:
   ConfigService

 )=>({

   type:'mysql',

   host:

    config.get(
      'DB_HOST'
    ),

   port:

    Number(

      config.get(
        'DB_PORT'
      )

    ),

   username:

    config.get(
      'DB_USER'
    ),

   password:

    config.get(
      'DB_PASSWORD'
    ),

   database:

    config.get(
      'DB_NAME'
    ),

   logging:

    config.get(
      'DB_LOGGING'
    ) === 'true',

   synchronize:

    config.get(
      'DB_SYNC'
    ) === 'true',

   autoLoadEntities:true,

 })

}),

   EventEmitterModule.forRoot(),

   ChatModule,

   AuthModule,

   UserModule,

   FriendshipModule,

   RedisModule,

   QueueConfig,

   HealthModule,

 ],

 providers:[


   {

   provide:

   APP_GUARD,

   useClass:

   ThrottlerGuard,

 },


    AppService,

 ],

})

export class AppModule {}
