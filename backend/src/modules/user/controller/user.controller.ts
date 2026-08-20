import {
  Controller,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

import { AuthGuard } from '../../../guards/jwt-auth.guard';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req) {

    return this.userService.getProfile(
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateProfileDto,
  ) {

    return this.userService.updateProfile(
      req.user.userId,
      dto,
    );
  }

  @UseGuards(AuthGuard)
  @Get('search')
  async search(
    @Query('q') q: string,
  ) {

    return this.userService.searchUsers(q);
  }
}