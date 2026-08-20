import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';

import { MessageService } from '../services/message.service';
import { SendMessageDto } from '../dto/send-message.dto';

import { AuthGuard } from '../../../../guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {

  constructor(
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async send(
    @Body() dto: SendMessageDto,
    @Req() req: any,
  ) {

    return this.messageService.sendMessage(
      dto,
      req.user.userId,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMessages(
    @Query('topicId') topicId: string,
    @Req() req,
  ) {

    const id = Number(topicId);

    return this.messageService.getMessageByTopic(
      id,
      req.user.userId,
    );
  }
}
