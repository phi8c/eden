import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { AuthGuard } from '../../../guards/jwt-auth.guard';



@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}

    @UseGuards(AuthGuard)

    @Get('me')
    async updateProfile(
        @Req() req,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.userService.updateProfile(req.ser.id, dto);
    }

}