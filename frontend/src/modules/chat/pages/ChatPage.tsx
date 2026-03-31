import { useEffect } from "react"
import ChatLayout from "../components/layout/index"
import chatStore from "../stores/chatStore"

export default function ChatPage() {

  useEffect(() => {
    chatStore.getConversations()
  }, [])

  return <ChatLayout />
}