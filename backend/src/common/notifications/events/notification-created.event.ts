import { NotificationType } from '../enums';

export class NotificationCreatedEvent {
  constructor(
    public readonly payload: {
      id: number;
      userId: number;
      actorId: number | null;
      type: NotificationType;
      conversationId: number | null;
      data: Record<string, unknown> | null;
      createdAt: Date;
    },
  ) {}
}
