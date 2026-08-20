import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';


import {

 RateLimit

}
from '../../../common/constants/rate-limit.constant';

import {Throttle}
from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Throttle({

 default:{

   ttl:60000,

   limit:3,

 }

})
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }




  @Throttle({

 default:{

   ttl:RateLimit.REGISTER_TTL,

   limit:RateLimit.REGISTER_LIMIT,

 }

})
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }


  @Throttle({

 default:{

   ttl:RateLimit.LOGIN_TTL,

   limit:RateLimit.LOGIN_LIMIT,

 }

})
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refresh(req);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
