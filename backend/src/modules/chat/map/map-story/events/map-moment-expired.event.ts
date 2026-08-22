export class MapMomentExpiredEvent {
  constructor(
    public readonly payload: {
      momentId: number;
      sessionId: number;
      conversationId: number;
      userId: number;
      expiredAt: Date;
    },
  ) {}
}
