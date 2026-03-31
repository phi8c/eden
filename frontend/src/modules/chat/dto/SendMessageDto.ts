export interface SendMessageDto {
    conversationId: string;
    topicId: string
    content: string;
    type?: "text" | "image" | "file" | "sticker"
}