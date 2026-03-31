import { observer } from "mobx-react-lite"
import chatStore from "../../stores/chatStore"
import userStore from "../../../user/stores/userStore"

import {UserAvatar} from "../../../../shared/controls/avatar/index"

const MessageList = observer(() => {
  const messages = chatStore.currentMessages
  const currentUser = userStore.currentUser

  return (
    <div className="flex-fill overflow-auto p-3">

      {messages.map((msg) => {
        const isMe = msg.senderId === currentUser?.id

       
        const user = isMe ? currentUser : userStore.selectedUser

        return (
          <div
            key={msg.id}
            className={`mb-3 d-flex ${
              isMe ? "justify-content-end" : "justify-content-start"
            }`}
          >

            {!isMe && (
              <UserAvatar
                src={user?.profile?.avatarUrl}
  name={user?.profile?.displayName || user?.username}
  size={32}
  online={user?.presence?.status === 1}
              />
            )}

            <div
              className={`p-2 rounded ${
                isMe ? "bg-primary text-white" : "bg-light"
              }`}
              style={{ maxWidth: "60%" }}
            >

              {/* name */}
              {!isMe && (
                <div className="small fw-bold">
                  {user?.profile?.displayName || "User"}
                  {user?.presence?.status === 1 && (
                    <span className="text-success ms-2">●</span>
                  )}
                </div>
              )}

              {/* content */}
              <div>{msg.content}</div>

            </div>

          </div>
        )
      })}

    </div>
  )
})

export default MessageList