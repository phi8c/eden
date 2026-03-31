import type { Conversation } from "../../models/Conversation"

interface Props {
  conversation: Conversation
  onClick?: () => void
}

export default function ConversationItem({ conversation, onClick }: Props) {
  return (
    <div className="list-group-item" onClick={onClick}>
      <div className="fw-bold">{conversation.title}</div>
      <div className="text-muted small">
        {conversation.lastMessage}
      </div>
    </div>
  )
}