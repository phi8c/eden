import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageAttachment } from '../entities/message-attachment.entity';

@Injectable()
export class MessageAttachmentRepository {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly attachmentRepo: Repository<MessageAttachment>,
  ) {}

  create(data: Partial<MessageAttachment>) {
    return this.attachmentRepo.create(data);
  }

  saveMany(attachments: MessageAttachment[]) {
    return this.attachmentRepo.save(attachments);
  }
}
