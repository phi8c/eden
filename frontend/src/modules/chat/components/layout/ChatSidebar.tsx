"use client";

import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { FriendSearch } from "@/modules/friendship/components/FriendSearch";
import { ConversationList } from "../conversation/ConversationList";

interface ChatSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function ChatSidebar({
  collapsed = false,
  onToggle,
}: ChatSidebarProps) {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3">
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {currentUser?.user.username ?? "Dove Chat"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser?.user.email ?? "Dang tai profile"}
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="ml-auto"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </header>

      {!collapsed && (
        <div className="border-b p-3">
          <FriendSearch />
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <MessageCircle className="size-3.5" />
              Conversations
            </div>
          )}
          <ConversationList collapsed={collapsed} />
        </div>
      </ScrollArea>
    </aside>
  );
}
