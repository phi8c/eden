import { observer } from "mobx-react-lite"
import chatStore from "../../modules/chat/stores/chatStore"
import authStore from "../../modules/auth/stores/authStore"

const Conversation = observer(() => {
  const messages = chatStore.currentMessages || []
  const currentUserId = authStore.user?.id

  return (
    <div className="flex-fill overflow-auto p-3">
      {messages.length === 0 && (
        <div className="text-center text-muted">No messages</div>
      )}

      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId

        return (
          <div
            key={msg.id}
            className={`mb-3 d-flex ${
              isMine ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-2 rounded ${
                isMine ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ width: "60%" }}
            >
              {msg.content}
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default Conversation