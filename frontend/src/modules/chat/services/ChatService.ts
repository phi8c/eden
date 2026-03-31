import http from "../../../services/httpService"
import type { SendMessageDto } from "../dto/SendMessageDto"
import type { Conversation } from "../models/Conversation"
import type { Message } from "../models/Message"

class ChatService {

  public async getConversations(): Promise<Conversation[]> {
    try {
      const res = await http.get("/conversations")

      console.log("API DATA:", res.data) // debug

      return res.data // 🔥 FIX CHÍNH
    } catch (err) {
      console.error("getConversations error:", err)
      return []
    }
  }

  public async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const res = await http.get("/chat/messages", {
        params: { conversationId }
      })
      return res.data?.result || []  // 🔥 FIX
    } catch (err) {
      console.error("getMessages error:", err)
      return []
    }
  }

  public async sendMessage(dto: SendMessageDto): Promise<Message> {
    const res = await http.post("/chat/send-message", dto)
    return res.data.result           // cái này OK vì BE luôn trả message
  }

}

export default new ChatService()