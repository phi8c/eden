"use client";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Conversation } from "../../types/chat.types";

interface ConversationItemProps {
  conversation: Conversation;
  active?: boolean;
  collapsed?: boolean;
  onSelect?: () => void;
}

export function ConversationItem({
  conversation,
  active = false,
  collapsed = false,
  onSelect,
}: ConversationItemProps) {
  const displayName =
    conversation.title ||
    conversation.members
      .map((member) => `User ${member.user_id}`)
      .join(", ") ||
    `Conversation ${conversation.id}`;
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-muted",
        active && "bg-muted",
        collapsed && "justify-center px-1",
      )}
      onClick={onSelect}
    >
      <Avatar size="lg">
        <AvatarFallback>{initials}</AvatarFallback>
        <AvatarBadge className="bg-emerald-500 ring-background" />
      </Avatar>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {conversation.lastMessageAt
                ? new Date(conversation.lastMessageAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p className="truncate text-xs text-muted-foreground">
              {conversation.lastMessage ?? "Chua co tin nhan"}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
