export class MapShareRequestedEvent {
  constructor(
    public readonly payload: {
      sessionId: number;
      conversationId: number;
      requestedBy: number;
      requestedTo: number;
      durationMinutes: number;
    },
  ) {}
}
