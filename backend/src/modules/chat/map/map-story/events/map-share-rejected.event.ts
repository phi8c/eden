export class MapShareRejectedEvent {
  constructor(
    public readonly payload: {
      sessionId: number;
      conversationId: number;
      rejectedBy: number;
      requestedBy: number;
    },
  ) {}
}
