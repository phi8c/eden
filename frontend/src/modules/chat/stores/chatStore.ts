import { makeAutoObservable, runInAction } from "mobx"
import chatService from "../services/ChatService"

import type { Conversation } from "../models/Conversation"
import type { Message } from "../models/Message"

class ChatStore {
  conversations: Conversation[] = []


  messages: Record<string, Message[]> = {}

  activeConversationId: string | null = null
  currentTopicId: string | null = null

  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }


  async getConversations() {
  this.isLoading = true

  try {
    const result = await chatService.getConversations()
    console.log("API result:", result)

    runInAction(() => {
      const conversations = result || []   // 🔥 FIX

      this.conversations = conversations

      if (conversations.length > 0) {
        this.setActiveConversation(conversations[0].id)
      }
    })
  } catch (err) {
    console.error("getConversations error:", err)
  } finally {
    runInAction(() => {
      this.isLoading = false
    })
  }
}

 
  setActiveConversation(conversationId: string) {
    this.activeConversationId = conversationId

   
    this.currentTopicId = null
    this.messages = {}
  }


  async getMessages(topicId: string) {
    this.isLoading = true

    try {
      const result = await chatService.getMessages(topicId)

      runInAction(() => {
        this.messages[topicId] = result
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // ==============================
  // 🔥 SET TOPIC (SOURCE OF TRUTH)
  // ==============================
  setActiveTopic(topicId: string) {
    this.currentTopicId = topicId

    // 🔥 chỉ fetch nếu chưa có cache
    if (!this.messages[topicId]) {
      this.getMessages(topicId)
    }
  }

  // ==============================
  // 🔥 SEND MESSAGE
  // ==============================
  async sendMessage(content: string) {
    if (!this.activeConversationId || !this.currentTopicId) return

    const message = await chatService.sendMessage({
      conversationId: this.activeConversationId,
      topicId: this.currentTopicId,
      content,
      type: "text",
    })

    runInAction(() => {
      if (!this.messages[this.currentTopicId!]) {
        this.messages[this.currentTopicId!] = []
      }

      this.messages[this.currentTopicId!].push(message)
    })
  }


  get currentMessages(): Message[] {
    if (!this.currentTopicId) return []
    return this.messages[this.currentTopicId] || []
  }
}

const chatStore = new ChatStore()
export default chatStore