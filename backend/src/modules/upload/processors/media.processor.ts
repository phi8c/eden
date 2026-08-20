import {

 Processor,

 WorkerHost

}

from '@nestjs/bullmq';

import {

 Job

}
from 'bullmq';

import {

 EventEmitter2

}
from '@nestjs/event-emitter';

import {

 SupabaseStorageService

}

from '../../../infrastructure/storage/services/supabase-storage.service';

import {

 ImageHelper

}

from '../../../helper/media/image.helper';

import {

 PathHelper

}

from '../../../helper/media/path.helper';

import {

 MediaUploadCompletedEvent

}

from '../events/media-upload-completed.event';


@Processor(

 'media'

)

export class MediaProcessor

extends WorkerHost{


 constructor(

   private storage:
   SupabaseStorageService,

   private emitter:
   EventEmitter2,

 ){

   super();

 }


 async process(

   job:Job,

 ){

   const {

      file,

      userId,

      type,

   }

   = job.data;


   let buffer =

   file.buffer;


   if(

      type ===

      'avatar'

   ){

      buffer =

      await

      ImageHelper.avatar(

        file.buffer

      );

   }


   const url =

   await

   this.storage.upload(

      buffer,

      PathHelper.avatar(

        userId

      ),

      file.mimetype,

   );


   this.emitter.emit(

      'media.upload.completed',

      new MediaUploadCompletedEvent(

          userId,

          url,

          type,

      )

   );

 }

}