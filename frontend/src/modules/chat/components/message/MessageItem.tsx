import type { Message } from "../../models/Message"

interface Props {
  message: Message
}

export default function MessageItem({ message }: Props) {
  return (
    <div className="mb-2">
      <div className="small text-muted">
        {message.senderId}
      </div>

      <div className="p-2 bg-light rounded">
        {message.content}
      </div>
    </div>
  )
}