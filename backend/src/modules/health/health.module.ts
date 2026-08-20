import { Module }
from '@nestjs/common';

import {

 TerminusModule

}
from '@nestjs/terminus';

import {

 HealthController

}
from './controllers/health.controller';

import {

 RedisModule

}
from '../../infrastructure/redis/redis.module';


@Module({

 imports:[

   TerminusModule,

   RedisModule,

 ],

 controllers:[

   HealthController,

 ],

})

export class HealthModule{}