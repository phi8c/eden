export class MediaUploadCompletedEvent{

 constructor(

   public readonly userId:number,

   public readonly url:string,

   public readonly type:string,

 ){

 }

}