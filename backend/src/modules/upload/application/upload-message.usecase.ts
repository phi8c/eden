import {

 Injectable,

 BadRequestException

}
from '@nestjs/common';

import {

 EventEmitter2

}
from '@nestjs/event-emitter';

import {

 MediaUploadRequestedEvent

}

from '../events/media-upload-requested.event';


@Injectable()

export class UploadMessageUseCase{


 constructor(

   private emitter:
   EventEmitter2,

 ){}


 async execute(

   userId:number,

   file:Express.Multer.File,

 ){

   const ok =

   file.mimetype

   .startsWith(

      'image'

   )

   ||

   file.mimetype

   .startsWith(

      'video'

   );


   if(

      !ok

   ){

      throw new

      BadRequestException(

        'Only image/video'

      );

   }


   const type =

   file.mimetype

   .startsWith(

      'video'

   )

   ? 'video'

   : 'message';


   this.emitter.emit(

      'media.upload.requested',

      new

      MediaUploadRequestedEvent(

         userId,

         file,

         type,

      )

   );


   return {

      message:

      'Upload queued'

   };

 }

}