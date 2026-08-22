"use client";

import { SmilePlus } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { useToggleMessageReaction } from "../../hooks/useToggleMessageReaction";
import type { MessageReaction } from "../../types/chat.types";

interface MessageReactionsProps {
  messageId: number;
  reactions: MessageReaction[];
  currentUserId?: number | null;
  mine?: boolean;
}

const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export function MessageReactions({
  messageId,
  reactions,
  currentUserId,
  mine = false,
}: MessageReactionsProps) {
  const [open, setOpen] = useState(false);
  const toggleReaction = useToggleMessageReaction();
  const grouped = useMemo(() => {
    const groups = new Map<
      string,
      { reaction: string; count: number; mine: boolean }
    >();

    reactions.forEach((item) => {
      if (!item.reaction) {
        return;
      }

      const current = groups.get(item.reaction) ?? {
        reaction: item.reaction,
        count: 0,
        mine: false,
      };

      current.count += 1;
      current.mine = current.mine || item.userId === currentUserId;
      groups.set(item.reaction, current);
    });

    return [...groups.values()];
  }, [currentUserId, reactions]);

  const react = (reaction: string) => {
    toggleReaction.mutate({ messageId, reaction });
    setOpen(false);
  };

  return (
    <div className={cn("relative mt-1 flex flex-wrap gap-1", mine && "justify-end")}>
      {grouped.map((group) => (
        <button
          key={group.reaction}
          type="button"
          className={cn(
            "rounded-full px-2 py-0.5 text-xs shadow-sm ring-1",
            group.mine
              ? "bg-[var(--dove-cream)] text-[var(--dove-primary)] ring-[var(--dove-primary-light)]"
              : "bg-background text-foreground ring-border",
          )}
          onClick={() => react(group.reaction)}
        >
          {group.reaction} {group.count}
        </button>
      ))}

      <button
        type="button"
        className={cn(
          "grid size-6 place-items-center rounded-full text-xs shadow-sm ring-1",
          mine
            ? "bg-white/20 text-white ring-white/30"
            : "bg-background text-muted-foreground ring-border",
        )}
        aria-label="React to message"
        onClick={() => setOpen((value) => !value)}
      >
        <SmilePlus className="size-3.5" />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute bottom-8 z-30 flex gap-1 rounded-full border bg-background p-1 shadow-lg",
            mine ? "right-0" : "left-0",
          )}
        >
          {quickReactions.map((reaction) => (
            <button
              key={reaction}
              type="button"
              className="grid size-8 place-items-center rounded-full text-lg hover:bg-muted"
              onClick={() => react(reaction)}
            >
              {reaction}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
