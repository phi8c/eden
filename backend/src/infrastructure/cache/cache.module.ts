import {

 CacheModule

}
from '@nestjs/cache-manager';

export const AppCache =

CacheModule.register({

 isGlobal:true,

 ttl:

   1000 * 60,

});