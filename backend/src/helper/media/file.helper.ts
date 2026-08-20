import mime
from 'mime-types';


export class FileHelper{


 static getMime(

   filename:string,

 ){

   return mime.lookup(

      filename

   );

 }



 static isImage(

   filename:string,

 ){

   const type =

   this.getMime(
      filename
   );


   return String(type)

   .startsWith(

      'image/'

   );

 }



 static isVideo(

   filename:string,

 ){

   const type =

   this.getMime(
      filename
   );


   return String(type)

   .startsWith(

      'video/'

   );

 }


}