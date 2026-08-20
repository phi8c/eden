import {

 Injectable

}
from '@nestjs/common';

import {

 UploadAvatarUseCase

}

from '../application/upload-avatar.usecase';

import {

 UploadMessageUseCase

}

from '../application/upload-message.usecase';


@Injectable()

export class UploadService{


 constructor(

   private avatar:
   UploadAvatarUseCase,

   private message:
   UploadMessageUseCase,

 ){}


 uploadAvatar(

   userId:number,

   file:
   Express.Multer.File,

 ){

   return this.avatar.execute(

      userId,

      file,

   );

 }


 uploadMessage(

   userId:number,

   file:
   Express.Multer.File,

 ){

   return this.message.execute(

      userId,

      file,

   );

 }

}