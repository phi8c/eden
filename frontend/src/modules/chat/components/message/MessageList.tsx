"use client";

import { useEffect, useMemo, useRef } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useMessages } from "../../hooks/useMessages";
import { useChatUiStore } from "../../stores/chat-ui.store";
import { MessageAttachments } from "./MessageAttachments";
import { MessageGif } from "./MessageGif";
import { MessageReactions } from "./MessageReactions";

interface MessageListProps {
  topicId: number | null;
}

export function MessageList({ topicId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const { data: messages = [], isLoading, isError } = useMessages(topicId);
  const topicTyping = useChatUiStore((state) =>
    topicId ? state.typingByTopic[topicId] : undefined,
  );
  const typingUsers = useMemo(
    () => Object.values(topicTyping ?? {}),
    [topicTyping],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  }, [messages.length, typingUsers.length]);

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
                  ? "bg-[var(--dove-primary)] text-white"
                  : "border bg-background text-foreground",
              )}
            >
              {message.type === 4 &&
              typeof message.metadata?.gifUrl === "string" ? (
                <MessageGif url={message.metadata.gifUrl} />
              ) : null}
              <MessageAttachments
                attachments={message.attachments ?? []}
                mine={mine}
              />
              {message.content &&
              !(
                message.type === 4 &&
                typeof message.metadata?.gifUrl === "string" &&
                message.content === message.metadata.gifUrl
              ) ? (
                <p className="text-sm leading-6">{message.content}</p>
              ) : null}
              <p
                className={cn(
                  "mt-1 text-[11px]",
                  mine ? "text-white/75" : "text-muted-foreground",
                )}
              >
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <MessageReactions
                messageId={message.id}
                reactions={message.reactions ?? []}
                currentUserId={currentUserId}
                mine={mine}
              />
            </article>
          </div>
        );
      })}
      {typingUsers.length > 0 ? (
        <div className="flex justify-start">
          <div className="rounded-full bg-[var(--dove-cream)] px-3 py-1.5 text-xs font-medium text-[var(--dove-primary)] shadow-sm">
            Dang soan tin nhan...
          </div>
        </div>
      ) : null}
      <div ref={bottomRef} />
    </div>
  );
}
