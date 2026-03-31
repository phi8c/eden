import { useState } from "react"
import { observer } from "mobx-react-lite"

import chatStore from "../../modules/chat/stores/chatStore"

const ChatInput = observer(() => {
  const [text, setText] = useState("")

  const handleSend = async () => {
    if (!text.trim()) return

    await chatStore.sendMessage(text)

    setText("")
  }

  return (
    <div className="border-top p-3 bg-white">
      <div className="d-flex align-items-center gap-2">

        {/* Sticker */}
        <button
          className="btn btn-light"
          onClick={() => {
            console.log("Open sticker picker")
          }}
        >
          🙂
        </button>

        {/* File upload */}
        <input
          type="file"
          hidden
          id="file-upload"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              console.log("Send file:", file)
              // 👉 sau này gọi chatStore.sendFile(file)
            }
          }}
        />

        <label htmlFor="file-upload" className="btn btn-light">
          📎
        </label>

        {/* Input */}
        <input
          className="form-control"
          value={text}
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend()
            }
          }}
        />

        {/* Send */}
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>

      </div>
    </div>
  )
})

export default ChatInput