export class MediaUploadRequestedEvent{

 constructor(

   public readonly userId:number,

   public readonly file:Express.Multer.File,

   public readonly type:
   'avatar' |

   'message' |

   'video',

 ){

 }

}   