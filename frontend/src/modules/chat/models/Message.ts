export interface Message {
id: string;
conversationId: string;
senderId:number;
content: string;
type: "text" | "image" | "file" | "sticker";
createdAt: number;
}