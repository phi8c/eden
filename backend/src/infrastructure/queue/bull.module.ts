import { Module }
from '@nestjs/common';

import { ConfigModule }
from '@nestjs/config';

import { ConfigService }
from '@nestjs/config';

import {
 BullModule
}
from '@nestjs/bullmq';

import { MessageQueue }
from './queues/message.queue';

import {MediaQueue} from '../../modules/upload/queues/media.queue'


@Module({

 imports:[

   ConfigModule,


   BullModule.forRootAsync({

      imports:[

         ConfigModule

      ],

      inject:[

         ConfigService

      ],


      useFactory:(

        config:
        ConfigService

      )=>({

         connection:{

            host:

            config.get(
              'REDIS_HOST'
            ),

            port:

            Number(

               config.get(
                 'REDIS_PORT'
               )

            ),

            username:

            config.get(
              'REDIS_USERNAME'
            ),

            password:

            config.get(
              'REDIS_PASSWORD'
            ),

         }

      })

   }),


   BullModule.registerQueue({

      name:'message',

   }),

   BullModule.registerQueue({

 name:'media'

}),


  

 ],


 providers:[

    MessageQueue,
    MediaQueue

 ],


 exports:[

    BullModule,

    MessageQueue,

    MediaQueue

 ],

})

export class QueueConfig{}