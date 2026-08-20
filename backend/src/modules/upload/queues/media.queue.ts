import {

 Injectable

}
from '@nestjs/common';

import {

 InjectQueue

}
from '@nestjs/bullmq';

import {

 Queue

}
from 'bullmq';


@Injectable()

export class MediaQueue{

 constructor(

  @InjectQueue(

    'media'

  )

  private queue:
  Queue,

 ){}


 async upload(

   payload:any,

 ){

   await this.queue.add(

      'upload',

      payload,

   );

 }

}   