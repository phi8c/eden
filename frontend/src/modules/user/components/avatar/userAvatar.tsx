import { observer } from "mobx-react-lite"
import chatStore from "../../../chat/stores/chatStore"
import userStore from "../../stores/userStore"

import { UserAvatar } from "../../../../shared/controls/avatar"

const MessageList = observer(() => {
  const messages = chatStore.currentMessages
  const currentUser = userStore.currentUser

  return (
    <div className="flex-fill overflow-auto p-3">

      {messages.map((msg) => {
        const isMe = msg.senderId === currentUser?.id

        const user = isMe
          ? currentUser
          : userStore.getUser(msg.senderId)

        return (
          <div
            key={msg.id}
            className={`mb-3 d-flex ${
              isMe ? "justify-content-end" : "justify-content-start"
            }`}
          >

            {/* 👤 Avatar */}
            {!isMe && (
              <UserAvatar
                src={user?.profile?.avatarUrl}
                name={user?.profile?.displayName || user?.username}
                size={32}
                online={user?.presence?.status === 1}
              />
            )}

            {/* 💬 Message */}
            <div
              className={`p-2 rounded ${
                isMe ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ maxWidth: "60%" }}
            >

              {/* Name */}
              {!isMe && (
                <div className="small fw-bold mb-1">
                  {user?.profile?.displayName || user?.username || "User"}
                </div>
              )}

              {/* Content */}
              <div>{msg.content}</div>

            </div>

          </div>
        )
      })}

    </div>
  )
})

export default MessageList