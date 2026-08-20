import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';

import { ConversationService } from '../services/conversation.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { AuthGuard } from '../../../../guards/jwt-auth.guard';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(AuthGuard)
  @Post()
  createConversation(@Req() req, @Body() dto: CreateConversationDto) {
    return this.conversationService.createConversation(req.user.userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  getMyConversations(@Req() req) {
    console.log('REQ.USER:', req.user);
    console.log('in ra', req.user.userId);
    return this.conversationService.getUserConversations(req.user.userId);
  }
}
