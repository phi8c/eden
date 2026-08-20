import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { FriendshipService } from '../services/friendship.service';
import { SendFriendRequestDto } from '../dto/send-friend-request.dto';
import { AuthGuard } from '../../../guards/jwt-auth.guard';

@Controller('friends')
@UseGuards(AuthGuard)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('request')
  sendRequest(@Req() req, @Body() dto: SendFriendRequestDto) {
    return this.friendshipService.sendRequest(req.user.userId, dto);
  }

  @Post(':id/accept')
  accept(@Req() req, @Param('id') id: number) {
    return this.friendshipService.accept(req.user.userId, id);
  }

  @Post(':id/reject')
  reject(@Req() req, @Param('id') id: number) {
    return this.friendshipService.reject(req.user.userId, id);
  }

  @Delete(':id')
  unfriend(@Req() req, @Param('id') id: number) {
    return this.friendshipService.unfriend(req.user.userId, id);
  }

  @Get()
  getFriends(@Req() req) {
    return this.friendshipService.getFriends(req.user.userId);
  }

  @Get('pending')
  getPending(@Req() req) {
    return this.friendshipService.getPending(req.user.userId);
  }
}
