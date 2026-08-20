import {

 Injectable,

 InternalServerErrorException

}
from '@nestjs/common';

import {

 ConfigService

}
from '@nestjs/config';

import {

 createClient

}
from '@supabase/supabase-js';

import {    

 StorageProvider

}
from '../interfaces/storage.interface';


@Injectable()

export class SupabaseStorageService

implements StorageProvider{


 private supabase;


 constructor(

   private readonly config:
   ConfigService,

 ){

   this.supabase =

   createClient(

      this.config.get(
        'SUPABASE_URL'
      )!,

      this.config.get(
        'SUPABASE_SERVICE_ROLE'
      )!,

   );

 }


 async upload(

   buffer:Buffer,

   path:string,

   mime:string,

 ){

   const bucket =

   this.config.get(
      'SUPABASE_BUCKET'
   );


   const {

      error

   }

   = await

   this.supabase.storage

   .from(bucket!)

   .upload(

      path,

      buffer,

      {

         contentType:
         mime,

         upsert:true,

      }

   );


   if(error){

      throw new InternalServerErrorException(

         error.message

      );

   }


   const {

      data

   }

   = this.supabase.storage

   .from(bucket!)

   .getPublicUrl(

      path

   );


   return data.publicUrl;

 }



 async delete(

   path:string,

 ){

   await

   this.supabase.storage

   .from(

      this.config.get(
        'SUPABASE_BUCKET'
      )!

   )

   .remove([

      path

   ]);

 }

}