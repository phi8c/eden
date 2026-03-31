import { makeAutoObservable, runInAction } from "mobx"
import TopicService from "../services/TopicService"
import type { Topic } from "../models/Topic"

class TopicStore {
  topics: Topic[] = []

  constructor() {
    makeAutoObservable(this)
  }

  // ==============================
  // 🔥 LOAD TOPICS
  // ==============================
  async loadTopics(conversationId: number) {
    const result = await TopicService.getTopics(conversationId)

    runInAction(() => {
      this.topics = result
    })
  }

  // ==============================
  // 🔥 CREATE TOPIC
  // ==============================
  async createTopic(conversationId: number, name: string) {
    const newTopic = await TopicService.createTopic(conversationId, name)

    runInAction(() => {
      this.topics.push(newTopic)
    })
  }
}

const topicStore = new TopicStore()
export default topicStore