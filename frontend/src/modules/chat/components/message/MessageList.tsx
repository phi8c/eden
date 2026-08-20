"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useMessages } from "../../hooks/useMessages";

interface MessageListProps {
  topicId: number | null;
}

export function MessageList({ topicId }: MessageListProps) {
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const { data: messages = [], isLoading, isError } = useMessages(topicId);

  if (!topicId) {
    return (
      <div className="grid min-h-full place-items-center p-6 text-center text-sm text-muted-foreground">
        Chon mot topic de xem tin nhan.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Dang tai tin nhan
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid min-h-full place-items-center p-6 text-center text-sm text-destructive">
        Khong tai duoc tin nhan.
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="grid min-h-full place-items-center p-6 text-center text-sm text-muted-foreground">
        Chua co tin nhan. Gui cau dau tien di.
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col justify-end gap-3 p-4">
      {messages.map((message) => {
        const mine = message.senderId === currentUserId;

        return (
          <div
            key={message.id}
            className={cn("flex", mine ? "justify-end" : "justify-start")}
          >
            <article
              className={cn(
                "max-w-[78%] rounded-lg px-3 py-2 shadow-sm",
                mine
                  ? "bg-zinc-950 text-white"
                  : "border bg-background text-foreground",
              )}
            >
              <p className="text-sm leading-6">{message.content}</p>
              <p
                className={cn(
                  "mt-1 text-[11px]",
                  mine ? "text-zinc-300" : "text-muted-foreground",
                )}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
