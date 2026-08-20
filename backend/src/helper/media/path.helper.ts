import {
 v7 as uuid
}
from 'uuid';


export class PathHelper{


 static avatar(
   userId:number,
 ):string{

   return `avatars/user_${userId}/${uuid()}.webp`;

 }


 static message():string{

   const year =
   new Date().getFullYear();

   const month =
   String(
      new Date()
      .getMonth()+1
   ).padStart(2,'0');


   return `messages/${year}/${month}/${uuid()}.webp`;

 }


 static video():string{

   const year =
   new Date().getFullYear();


   return `videos/${year}/${uuid()}.mp4`;

 }

}