"use client";

import { Download } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { MessageAttachment } from "../../types/chat.types";

interface MessageAttachmentsProps {
  attachments: MessageAttachment[];
  mine?: boolean;
}

export function MessageAttachments({
  attachments,
  mine = false,
}: MessageAttachmentsProps) {
  const [activeAttachmentId, setActiveAttachmentId] = useState<number | null>(
    null,
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (attachments.length === 0) {
    return null;
  }

  const clearPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPress = (attachmentId: number) => {
    clearPress();
    timerRef.current = setTimeout(() => {
      setActiveAttachmentId(attachmentId);
    }, 450);
  };

  return (
    <div
      className={cn(
        "grid gap-2",
        attachments.length > 1 && "grid-cols-2",
        attachments.length > 0 && "mb-2",
      )}
    >
      {attachments.map((attachment) => {
        const isVideo = attachment.mimeType?.startsWith("video/");
        const showMenu = activeAttachmentId === attachment.id;

        return (
          <div
            key={attachment.id}
            className="relative overflow-hidden rounded-lg bg-black/5"
            onContextMenu={(event) => {
              event.preventDefault();
              setActiveAttachmentId(attachment.id);
            }}
            onMouseDown={() => startPress(attachment.id)}
            onMouseUp={clearPress}
            onMouseLeave={clearPress}
            onTouchStart={() => startPress(attachment.id)}
            onTouchEnd={clearPress}
            onTouchCancel={clearPress}
          >
            {isVideo ? (
              <video
                src={attachment.url}
                className="max-h-64 w-full object-cover"
                controls
                preload="metadata"
              />
            ) : (
              <img
                src={attachment.url}
                alt="Message attachment"
                className="max-h-64 w-full object-cover"
                draggable={false}
              />
            )}

            {showMenu ? (
              <div className="absolute inset-0 grid place-items-center bg-black/35 p-3">
                <a
                  href={attachment.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-lg",
                    mine
                      ? "bg-white text-[var(--dove-primary)]"
                      : "bg-[var(--dove-primary)] text-white",
                  )}
                  onClick={() => setActiveAttachmentId(null)}
                >
                  <Download className="size-4" />
                  Tai xuong
                </a>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
