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
  StoragePurpose,
  StorageService,
} from '../../../common/storage';

import {

 ImageHelper

}

from '../../../helper/media/image.helper';

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
   StorageService,

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


   const purpose =

   type === 'avatar'

   ? StoragePurpose.AVATAR

   : StoragePurpose.MESSAGE_ATTACHMENT;


   const upload =

   await

   this.storage.uploadFile({

      ownerUserId:
      userId,

      purpose,

      buffer,

      originalFilename:
      file.originalname,

      mimeType:
      file.mimetype,

      sizeBytes:
      file.size,

   });


   this.emitter.emit(

      'media.upload.completed',

      new MediaUploadCompletedEvent(

          userId,

          upload.url,

          type,

      )

   );

 }

}
