export class MapSessionExpiredEvent {
  constructor(
    public readonly payload: {
      sessionId: number;
      conversationId: number;
      requestedBy: number;
      requestedTo: number;
      expiredAt: Date;
    },
  ) {}
}
