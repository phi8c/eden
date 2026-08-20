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

export class UploadAvatarUseCase{


 constructor(

   private readonly emitter:
   EventEmitter2,

 ){}


 async execute(

   userId:number,

   file:Express.Multer.File,

 ){

   if(

      !file.mimetype

      .startsWith(

        'image'

      )

   ){

      throw new

      BadRequestException(

        'Avatar must be image'

      );

   }


   this.emitter.emit(

      'media.upload.requested',

      new

      MediaUploadRequestedEvent(

         userId,

         file,

         'avatar',

      )

   );


   return {

      message:

      'Avatar queued'

   };

 }

}