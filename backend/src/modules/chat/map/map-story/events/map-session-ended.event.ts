export class MapSessionEndedEvent {
  constructor(
    public readonly payload: {
      sessionId: number;
      conversationId: number;
      endedBy: number;
      requestedBy: number;
      requestedTo: number;
    },
  ) {}
}
