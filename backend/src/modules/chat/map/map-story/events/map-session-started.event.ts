export class MapSessionStartedEvent {
  constructor(
    public readonly payload: {
      sessionId: number;
      conversationId: number;
      requestedBy: number;
      requestedTo: number;
      startedAt: Date;
      expiresAt: Date;
    },
  ) {}
}
