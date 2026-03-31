export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  type: "text" | "image" | "file" | "sticker"
  createdAt: Date
}