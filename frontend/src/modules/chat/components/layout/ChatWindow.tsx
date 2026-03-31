import MessageList from "../message/MessageList"
import ChatMessageInput from "../chatInput/ChatMessageInput"

export default function ChatWindow() {
  return (
    <div className="flex-grow-1 d-flex flex-column">

      <MessageList />

      <ChatMessageInput />

    </div>
  )
}