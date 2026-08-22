import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
  Req,
  UseGuards,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { MessageService } from '../services/message.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { ToggleMessageReactionDto } from '../dto/toggle-message-reaction.dto';

import { AuthGuard } from '../../../../guards/jwt-auth.guard';

const MAX_MESSAGE_MEDIA_BYTES = 50 * 1024 * 1024;
const MESSAGE_MEDIA_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/jpg',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

@Controller('messages')
export class MessageController {

  constructor(
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      limits: {
        fileSize: MAX_MESSAGE_MEDIA_BYTES,
      },
      fileFilter: (_req, file, callback) => {
        if (!MESSAGE_MEDIA_TYPES.has(file.mimetype)) {
          callback(
            new BadRequestException(
              'Only image, GIF, and video attachments are supported',
            ),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  async send(
    @Body() dto: SendMessageDto,
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {

    return this.messageService.sendMessage(
      dto,
      req.user.userId,
      files,
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

  @Post(':id/reactions')
  @UseGuards(AuthGuard)
  async toggleReaction(
    @Param('id') id: string,
    @Body() dto: ToggleMessageReactionDto,
    @Req() req: any,
  ) {
    return this.messageService.toggleReaction(
      Number(id),
      req.user.userId,
      dto.reaction,
    );
  }
}
