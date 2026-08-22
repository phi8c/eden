"use client";

import { Loader2 } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveConversationId } from "@/store/slices/chatSlice";
import { useChatUiStore } from "../../stores/chat-ui.store";
import { useConversations } from "../../hooks/useConversations";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
  collapsed?: boolean;
  variant?: "desktop" | "mobile";
}

export function ConversationList({
  collapsed = false,
  variant = "desktop",
}: ConversationListProps) {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );
  const setMobilePanel = useChatUiStore((state) => state.setMobilePanel);
  const { data: conversations = [], isLoading, isError } = useConversations();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-3 text-sm text-[var(--dove-text-gray)]">
        <Loader2 className="size-4 animate-spin" />
        {!collapsed && "Dang tai hoi thoai"}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="px-2 py-3 text-sm text-destructive">
        Khong tai duoc danh sach chat.
      </p>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="px-2 py-3 text-sm leading-6 text-[var(--dove-text-gray)]">
        Chua co hoi thoai nao. Phase 5 se them tao chat tu ban be.
      </p>
    );
  }

  return (
    <div
      className={
        variant === "mobile" ? "divide-y divide-[#F7EEE8]" : "grid gap-1"
      }
    >
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          active={activeConversationId === conversation.id}
          collapsed={collapsed}
          variant={variant}
          onSelect={() => {
            dispatch(setActiveConversationId(conversation.id));
            setMobilePanel("chat");
          }}
        />
      ))}
    </div>
  );
}
