export class MapShareAcceptedEvent {
  constructor(
    public readonly payload: {
      sessionId: number;
      conversationId: number;
      acceptedBy: number;
      requestedBy: number;
    },
  ) {}
}
