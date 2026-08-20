import { Injectable }
from '@nestjs/common';

import { Response }
from 'express';

@Injectable()

export class LogoutUseCase{

 execute(

   res:Response,

 ){

    res.clearCookie(

       'refresh_token'

    );

    return {

      message:

      'logged out'

    };

 }

}