export class MapMomentCreatedEvent {
  constructor(
    public readonly payload: {
      momentId: number;
      sessionId: number;
      conversationId: number;
      userId: number;
      recipientUserIds: number[];
      visibleUntil: Date;
      mediaUrl: string | null;
    },
  ) {}
}
