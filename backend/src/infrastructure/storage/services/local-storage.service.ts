import {

 Injectable

}
from '@nestjs/common';

import * as fs
from 'fs';

import * as pathLib
from 'path';

import {

 StorageProvider

}
from '../interfaces/storage.interface';


@Injectable()

export class LocalStorageService

implements StorageProvider{


 async upload(

   buffer:Buffer,

   path:string,

 ){

   const fullPath =

   pathLib.join(

      process.cwd(),

      'uploads',

      path,

   );


   fs.mkdirSync(

      pathLib.dirname(
        fullPath
      ),

      {

        recursive:true

      }

   );


   fs.writeFileSync(

      fullPath,

      buffer,

   );


   return fullPath;

 }



 async delete(

   path:string,

 ){

 }


}