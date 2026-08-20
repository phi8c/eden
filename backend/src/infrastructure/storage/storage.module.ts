import { Module }
from '@nestjs/common';

import {

 SupabaseStorageService

}
from './services/supabase-storage.service';

import {

 LocalStorageService

}
from './services/local-storage.service';


@Module({

 providers:[

   SupabaseStorageService,

   LocalStorageService,

 ],

 exports:[

   SupabaseStorageService,

   LocalStorageService,

 ],

})

export class StorageModule{}