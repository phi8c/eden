export class ConversationCreatedEvent {
  constructor(
    public readonly conversationId: number,
    public readonly memberIds: number[],
  ) {}
}
