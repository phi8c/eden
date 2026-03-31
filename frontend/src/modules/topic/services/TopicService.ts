import http from "../../../services/httpService"
import type { Topic } from "../models/Topic"

class TopicService {
  async getTopics(conversationId: number): Promise<Topic[]> {
    const res = await http.get(`/topics/conversation/${conversationId}`)
    return res.data
  }

  async createTopic(conversationId: number, name: string): Promise<Topic> {
    const res = await http.post(`/topics`, {
      conversationId,
      name,
    })
    return res.data
  }
}

export default new TopicService()