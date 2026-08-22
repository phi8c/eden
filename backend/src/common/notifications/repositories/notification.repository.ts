import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from '../entities';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  create(data: Partial<Notification>) {
    return this.repository.create(data);
  }

  save(notification: Notification) {
    return this.repository.save(notification);
  }

  findByUser(userId: number) {
    return this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}
