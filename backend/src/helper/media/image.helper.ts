import sharp
from 'sharp';

import { MEDIA }
from '../../common/constants/media.constant';


export class ImageHelper{


 static async avatar(

   file:Buffer

 ){

   return await

   sharp(file)

   .resize(

      MEDIA.AVATAR.width,

      MEDIA.AVATAR.height,

      {

         fit:'cover',

         position:'centre',

      }

   )

   .webp({

      quality:

      MEDIA.AVATAR.quality

   })

   .toBuffer();

 }



 static async cover(

   file:Buffer

 ){

   return await

   sharp(file)

   .resize(

      MEDIA.COVER.width,

      MEDIA.COVER.height,

   )

   .webp({

      quality:

      MEDIA.COVER.quality

   })

   .toBuffer();

 }



 static async message(

   file:Buffer

 ){

   return await

   sharp(file)

   .resize({

      width:

      MEDIA.MESSAGE.width,

      withoutEnlargement:true,

   })

   .webp({

      quality:

      MEDIA.MESSAGE.quality,

   })

   .toBuffer();

 }

}