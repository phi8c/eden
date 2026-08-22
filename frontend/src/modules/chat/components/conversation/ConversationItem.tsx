"use client";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import type { Conversation } from "../../types/chat.types";
import { getConversationDisplay } from "../../utils/conversation-display";

interface ConversationItemProps {
  conversation: Conversation;
  active?: boolean;
  collapsed?: boolean;
  variant?: "desktop" | "mobile";
  onSelect?: () => void;
}

export function ConversationItem({
  conversation,
  active = false,
  collapsed = false,
  variant = "desktop",
  onSelect,
}: ConversationItemProps) {
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const { displayName, initials, subtitle } = getConversationDisplay(
    conversation,
    currentUserId,
  );
  const mobile = variant === "mobile";

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 text-left transition",
        mobile
          ? "rounded-none px-6 py-4 hover:bg-[#F9F9F9]"
          : "rounded-lg px-2 py-2 hover:bg-[var(--dove-cream)]",
        active && (mobile ? "bg-[#FFF8F1]" : "bg-[var(--dove-cream)]"),
        collapsed && "justify-center px-1",
      )}
      onClick={onSelect}
    >
      <Avatar size="lg">
        <AvatarFallback className="bg-[var(--dove-avatar-bg)] text-[var(--dove-avatar-text)]">
          {initials}
        </AvatarFallback>
        <AvatarBadge className="bg-emerald-500 ring-background" />
      </Avatar>

      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "truncate font-semibold text-[var(--dove-primary)]",
                mobile ? "text-base" : "text-sm",
              )}
            >
              {displayName}
            </p>
            <span className="shrink-0 text-xs text-[var(--dove-text-gray)]">
              {conversation.lastMessageAt
                ? new Date(conversation.lastMessageAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p
              className={cn(
                "truncate",
                mobile
                  ? "max-w-[220px] text-sm text-[var(--dove-primary-light)]"
                  : "text-xs text-[var(--dove-primary-light)]",
              )}
            >
              {subtitle}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
