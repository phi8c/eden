import {

 Controller,

 Post,

 Req,

 UseGuards,

 UploadedFile,

 UseInterceptors

}
from '@nestjs/common';

import {

 FileInterceptor

}

from '@nestjs/platform-express';

import {

 AuthGuard

}

from '../../../guards/jwt-auth.guard';

import {

 UploadService

}

from '../services/upload.service';


@Controller(

 'upload'

)

@UseGuards(

 AuthGuard

)

export class UploadController{


 constructor(

   private service:
   UploadService,

 ){}


 @Post(

   'avatar'

 )

 @UseInterceptors(

   FileInterceptor(

      'file'

   )

 )

 avatar(

   @Req()
   req,

   @UploadedFile()
   file,

 ){

   return this.service
   .uploadAvatar(

      req.user.userId,

      file,

   );

 }



 @Post(

   'message'

 )

 @UseInterceptors(

    FileInterceptor(

      'file'

    )

 )

 message(

   @Req()
   req,

   @UploadedFile()
   file,

 ){

   return this.service
   .uploadMessage(

      req.user.userId,

      file,

   );

 }

}