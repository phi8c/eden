"use client";

import { ShieldCheck } from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useAppSelector } from "@/store/hooks";
import { useSocketStore } from "@/modules/realtime/stores/socket.store";
import { FriendsPanel } from "@/modules/friendship/components/FriendsPanel";
import { useConversations } from "../../hooks/useConversations";
import { getConversationDisplay } from "../../utils/conversation-display";

export function RightSidebar() {
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );
  const { data: conversations = [] } = useConversations();
  const status = useSocketStore((state) => state.status);
  const socketId = useSocketStore((state) => state.socketId);
  const joinedConversationId = useSocketStore(
    (state) => state.joinedConversationId,
  );
  const lastError = useSocketStore((state) => state.lastError);
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    null;
  const conversationDisplay = activeConversation
    ? getConversationDisplay(activeConversation, currentUserId)
    : null;
  const otherMember = conversationDisplay?.otherMember ?? null;
  const displayName = conversationDisplay?.displayName ?? "Chua chon hoi thoai";
  const email = otherMember?.user?.email ?? "Thong tin doi phuong se hien o day";
  const fallback = conversationDisplay?.initials ?? "?";

  return (
    <aside className="flex h-full min-h-0 flex-col border-l bg-background">
      <header className="flex h-14 shrink-0 items-center border-b px-4">
        <div>
          <p className="text-sm font-semibold">Details</p>
          <p className="text-xs text-muted-foreground">Thong tin hoi thoai</p>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
        <section className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback>{fallback || "?"}</AvatarFallback>
              {otherMember ? (
                <AvatarBadge className="bg-emerald-500 ring-background" />
              ) : null}
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {email}
              </p>
            </div>
          </div>
        </section>

        <FriendsPanel />

        <section className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-teal-700" />
            <div>
              <p className="text-sm font-medium">Realtime {status}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {joinedConversationId
                  ? `Joined conversation #${joinedConversationId}`
                  : socketId
                    ? `Socket ${socketId}`
                  : lastError ?? "Dang cho ket noi socket."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
