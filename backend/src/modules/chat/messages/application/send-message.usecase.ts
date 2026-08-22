import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';

import { MessageRepository } from '../repositories/message.repository';
import { MessageAttachmentRepository } from '../repositories/message-attachment.repository';

import { SendMessageDto } from '../dto/send-message.dto';

import { MessageCreatedEvent } from '../events/message-created.event';

import { getErrorMessage } from '../../../../helper/error.helper';

import { RedisService } from '../../../../infrastructure/redis/redis.service';

import {
  toMessageResponseDto,
} from '../dto/message-response.dto';
import { ConversationRepository } from '../../conversations/repositories/conversation.repository';
import { ConversationMemberRepository } from '../../conversations/repositories/conversation-member.repository';
import {
  StoragePurpose,
  StorageService,
} from '../../../../common/storage';

const MAX_MESSAGE_MEDIA_BYTES = 50 * 1024 * 1024;
const MAX_MESSAGE_ATTACHMENTS = 6;
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

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly messageRepo: MessageRepository,

    private readonly attachmentRepo: MessageAttachmentRepository,

    private readonly eventEmitter: EventEmitter2,

    private readonly redis: RedisService,

    private readonly conversationRepo: ConversationRepository,

    private readonly memberRepo: ConversationMemberRepository,

    private readonly storageService: StorageService,
  ) {}

  async execute(
    dto: SendMessageDto,

    userId: number,

    files: Express.Multer.File[] = [],
  ) {
    try {
      const content = dto.content?.trim() ?? '';

      if (!content && files.length === 0) {
        throw new BadRequestException(
          'Content or attachment is required',
        );
      }

      this.validateFiles(files);

      const isMember =
        await this.memberRepo.isMember(
          dto.conversationId,
          userId,
        );

      if (!isMember) {
        throw new ForbiddenException(
          'Access denied.',
        );
      }

      const message =
        await this.messageRepo.create({
          conversation_id: dto.conversationId,

          topic_id: dto.topicId,

          sender_id: userId,

          content,

          type: dto.type ?? this.resolveMessageType(files),

          metadata: dto.metadata ?? null,
        });

      const attachments =
        files.length > 0
          ? await this.createAttachments(
              message.id,
              userId,
              dto.conversationId,
              dto.topicId,
              files,
            )
          : [];

      message.attachments = attachments;

      await this.conversationRepo.updateLastMessage(
        dto.conversationId,
        message.id,
      );

      const members =
        await this.memberRepo.findByConversationId(
          dto.conversationId,
        );

      await Promise.all([
        this.redis.del(
          `messages:${dto.topicId}`,
        ),

        ...members.map((member) =>
          this.redis.del(
            `conversations:v2:${member.user_id}`,
          ),
        ),
      ]);

      this.eventEmitter.emit(
        'message.created',

        new MessageCreatedEvent({
          id: message.id,

          conversationId:
            message.conversation_id,

          topicId:
            message.topic_id,

          senderId:
            message.sender_id,

          content:
            message.content,

          type:
            message.type,

          createdAt:
            message.created_at,

          metadata:
            message.metadata ?? null,

          attachments:
            attachments.map((attachment) => ({
              id: Number(attachment.id),
              url: attachment.file_url,
              mimeType: attachment.file_type,
              createdAt: attachment.created_at,
            })),
        }),
      );

      return toMessageResponseDto(
        message,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        getErrorMessage(error),
      );
    }
  }

  private validateFiles(files: Express.Multer.File[]) {
    if (files.length > MAX_MESSAGE_ATTACHMENTS) {
      throw new BadRequestException(
        `Maximum ${MAX_MESSAGE_ATTACHMENTS} attachments per message`,
      );
    }

    files.forEach((file) => {
      if (!MESSAGE_MEDIA_TYPES.has(file.mimetype)) {
        throw new BadRequestException(
          'Only image, GIF, and video attachments are supported',
        );
      }

      if (file.size > MAX_MESSAGE_MEDIA_BYTES) {
        throw new BadRequestException(
          'Attachment size must be 50MB or smaller',
        );
      }
    });
  }

  private resolveMessageType(files: Express.Multer.File[]) {
    if (files.length === 0) {
      return 1;
    }

    if (files.some((file) => file.mimetype.startsWith('video/'))) {
      return 3;
    }

    return 2;
  }

  private async createAttachments(
    messageId: number,
    userId: number,
    conversationId: number,
    topicId: number,
    files: Express.Multer.File[],
  ) {
    const uploads = await Promise.all(
      files.map((file) =>
        this.storageService.uploadFile({
          ownerUserId: userId,
          purpose: StoragePurpose.MESSAGE_ATTACHMENT,
          buffer: file.buffer,
          originalFilename: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          folderContext: {
            conversationId,
            topicId,
          },
        }),
      ),
    );

    return this.attachmentRepo.saveMany(
      uploads.map((upload) =>
        this.attachmentRepo.create({
          message_id: messageId,
          file_url: upload.url,
          file_type: upload.mimeType,
        }),
      ),
    );
  }
}
