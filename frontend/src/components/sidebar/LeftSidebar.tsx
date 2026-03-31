interface LeftSidebarProps {
  chats?: { id: string; title: string }[]
  activeChatId?: string
  onSelectChat?: (id: string) => void
}
export default function LeftSidebar({
  chats = [],
  activeChatId,
  onSelectChat,
}: LeftSidebarProps) {
  return (
    <div
      className="border-end bg-light d-flex flex-column"
      style={{ width: "260px" }}
    >
      <div className="p-3 border-bottom fw-bold">
        Chats
      </div>

      <div className="flex-fill overflow-auto">

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 border-bottom ${
              chat.id === activeChatId ? "bg-white" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => onSelectChat?.(chat.id)}
          >
            {chat.title}
          </div>
        ))}

      </div>
    </div>
  )
}