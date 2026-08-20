"use client";

import type { CSSProperties } from "react";

import { useAppSelector } from "@/store/hooks";
import { useConversationSocket } from "@/modules/realtime/hooks/useConversationSocket";
import { useSocketConnection } from "@/modules/realtime/hooks/useSocketConnection";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { MobileChatLayout } from "./MobileChatLayout";
import { RightSidebar } from "./RightSidebar";
import { useChatUiStore } from "../../stores/chat-ui.store";

export function ChatShell() {
  const leftCollapsed = useChatUiStore((state) => state.leftCollapsed);
  const toggleLeftCollapsed = useChatUiStore(
    (state) => state.toggleLeftCollapsed,
  );
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );

  useSocketConnection();
  useConversationSocket(activeConversationId);

  return (
    <>
      <div
        style={
          {
            "--left-width": leftCollapsed ? "76px" : "320px",
          } as CSSProperties
        }
        className="hidden h-dvh min-h-0 grid-cols-[var(--left-width)_minmax(0,1fr)_320px] overflow-hidden bg-background transition-[grid-template-columns] lg:grid"
      >
        <ChatSidebar
          collapsed={leftCollapsed}
          onToggle={toggleLeftCollapsed}
        />
        <ChatWindow />
        <RightSidebar />
      </div>

      <MobileChatLayout />
    </>
  );
}
