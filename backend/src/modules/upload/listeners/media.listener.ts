import {

 Injectable

}
from '@nestjs/common';

import {

 OnEvent

}
from '@nestjs/event-emitter';

import {

 MediaQueue

}

from '../queues/media.queue';

import {

 MediaUploadRequestedEvent

}

from '../events/media-upload-requested.event';


@Injectable()

export class MediaListener{


 constructor(

   private readonly queue:
   MediaQueue,

 ){}


 @OnEvent(

   'media.upload.requested'

 )

 async handle(

   event:

   MediaUploadRequestedEvent,

 ){

   await this.queue.upload(

      event

   );

 }

}