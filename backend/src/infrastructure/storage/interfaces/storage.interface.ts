export interface StorageProvider{

 upload(

   buffer:Buffer,

   path:string,

   mime:string,

 ):Promise<string>;


 delete(

   path:string,

 ):Promise<void>;

}