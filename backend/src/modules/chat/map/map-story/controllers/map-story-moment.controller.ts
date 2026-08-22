import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../../../../../guards/jwt-auth.guard';
import { MapStoryMomentService } from '../services';

const MAX_MOMENT_IMAGE_BYTES = 50 * 1024 * 1024;

@UseGuards(AuthGuard)
@Controller('map-sessions/:sessionId/moments')
export class MapStoryMomentController {
  constructor(private readonly momentService: MapStoryMomentService) {}

  @Get()
  getMoments(
    @Req() req,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.momentService.getMoments(req.user.userId, sessionId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_MOMENT_IMAGE_BYTES,
      },
    }),
  )
  createMoment(
    @Req() req,
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.momentService.createMoment(
      req.user.userId,
      sessionId,
      file,
    );
  }
}
