import ConversationList from "../conversation/ConversationList"
import AvatarListOnly from "./AvatarListOnly"

 export type ChatSidebarProps = {
  collapsed: boolean
  onToggle: () => void


}

export default function ChatSidebar  ({
  collapsed ,
  onToggle 

}: ChatSidebarProps ) {
  return (
    <div
      style={{
        width: collapsed ? 72 : 280,
        transition: "width 0.2s",
        borderRight: "1px solid #eee",
        overflow: "hidden"
      }}
    >

      <button onClick={onToggle}>
        Toggle
      </button>

      {collapsed ? (
        <AvatarListOnly />
      ) : (
        <ConversationList />
      )}

    </div>
  )
}