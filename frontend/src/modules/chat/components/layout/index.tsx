import { useState } from "react"

import ChatSidebar from "./ChatSidebar"
import ChatWindow from "./ChatWindow"
import RightSidebar from "./RightSidebar"

export default function ChatLayout() {

  const COLLAPSED_WIDTH = 70
  const DEFAULT_WIDTH = 280

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => {
    if (collapsed) {
      setSidebarWidth(DEFAULT_WIDTH)
      setCollapsed(false)
    } else {
      setSidebarWidth(COLLAPSED_WIDTH)
      setCollapsed(true)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {

    const startX = e.clientX
    const startWidth = sidebarWidth

    const onMouseMove = (moveEvent: MouseEvent) => {

      const newWidth = startWidth + (moveEvent.clientX - startX)

      const minWidth = 70
      const maxWidth = 400

      const width = Math.max(minWidth, Math.min(maxWidth, newWidth))

      setSidebarWidth(width)
      setCollapsed(width < 120)
    }

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div className="d-flex vh-100">

      <div style={{ width: sidebarWidth }}>

        <ChatSidebar
          collapsed={collapsed}
          onToggle={handleToggle}
        />

      </div>

      <div
        onMouseDown={handleMouseDown}
        style={{
          width: 4,
          cursor: "col-resize",
          background: "#eee"
        }}
      />

      <ChatWindow />

      <RightSidebar />

    </div>
  )
}