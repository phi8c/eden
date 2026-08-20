import {

 Module

}
from '@nestjs/common';

import {

 UploadController

}

from './controllers/upload.controller';

import {

 UploadService

}

from './services/upload.service';

import {

 UploadAvatarUseCase

}

from './application/upload-avatar.usecase';

import {

 UploadMessageUseCase

}

from './application/upload-message.usecase';

import {

 MediaListener

}

from './listeners/media.listener';

import {

 MediaProcessor

}

from './processors/media.processor';


@Module({

 controllers:[

   UploadController

 ],

 providers:[

   UploadService,

   UploadAvatarUseCase,

   UploadMessageUseCase,

   MediaListener,

   MediaProcessor,

 ],

})

export class UploadModule{}