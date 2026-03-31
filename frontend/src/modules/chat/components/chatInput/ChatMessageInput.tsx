import { useState } from "react"
import { observer } from "mobx-react-lite"
import chatStore from "../../stores/chatStore"

const ChatMessageInput = observer(() => {
  const [message, setMessage] = useState("")

  const handleSend = async () => {
    if (!message.trim()) return

    await chatStore.sendMessage(message)

    setMessage("")
  }

  return (
    <div className="border-top p-2">
      <div className="d-flex align-items-center gap-2">

        <button className="btn btn-light">😊</button>

        <button className="btn btn-light">📎</button>

        <input
          type="text"
          className="form-control"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend()
          }}
        />

        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>

      </div>
    </div>
  )
})

export default ChatMessageInput