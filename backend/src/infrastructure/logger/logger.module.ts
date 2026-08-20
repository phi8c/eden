import {

 LoggerModule

}
from 'nestjs-pino';

export const AppLogger =

LoggerModule.forRoot({

 pinoHttp:{

   transport:{

     target:
      'pino-pretty',

     options:{

        singleLine:true,

        colorize:true,

     }

   }

 }

});