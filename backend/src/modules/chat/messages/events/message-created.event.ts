export class MessageCreatedEvent {
    constructor(
    public readonly messageId: number,
    public readonly conversationId: number,
    public readonly senderId: number,
    public readonly content: string,
    ){}
}