import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../../../../../guards/jwt-auth.guard';
import { CreateMapShareRequestDto } from '../dto';
import { MapStorySessionService } from '../services';

@UseGuards(AuthGuard)
@Controller()
export class MapStorySessionController {
  constructor(private readonly sessionService: MapStorySessionService) {}

  @Post('conversations/:conversationId/map-share-requests')
  createShareRequest(
    @Req() req,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body() dto: CreateMapShareRequestDto,
  ) {
    return this.sessionService.createShareRequest(
      req.user.userId,
      conversationId,
      dto,
    );
  }

  @Post('map-sessions/:sessionId/accept')
  acceptShareRequest(
    @Req() req,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.sessionService.acceptShareRequest(req.user.userId, sessionId);
  }

  @Post('map-sessions/:sessionId/reject')
  rejectShareRequest(
    @Req() req,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.sessionService.rejectShareRequest(req.user.userId, sessionId);
  }

  @Post('map-sessions/:sessionId/end')
  endSession(
    @Req() req,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.sessionService.endSession(req.user.userId, sessionId);
  }

  @Get('conversations/:conversationId/map-session')
  getConversationSession(
    @Req() req,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.sessionService.getConversationSession(
      req.user.userId,
      conversationId,
    );
  }

  @Get('map-sessions/:sessionId/state')
  getSessionState(
    @Req() req,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.sessionService.getSessionState(req.user.userId, sessionId);
  }
}
