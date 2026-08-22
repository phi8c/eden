"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import {
  ImagePlay,
  MapPin,
  Mic,
  Paperclip,
  SendHorizontal,
  Smile,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/store/hooks";
import { socketManager } from "@/modules/realtime/managers/socket-manager";
import { useSendMessage } from "../../hooks/useSendMessage";
import { useChatUiStore } from "../../stores/chat-ui.store";
import type { SendMessagePayload } from "../../types/chat.types";

const MAX_ATTACHMENTS = 6;
const ACCEPTED_MESSAGE_MEDIA = "image/*,video/mp4,video/webm,video/quicktime";

export function ChatComposer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const stopTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingRef = useRef(false);
  const [files, setFiles] = useState<File[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [gifUrl, setGifUrl] = useState("");
  const draft = useChatUiStore((state) => state.composerDraft);
  const setDraft = useChatUiStore((state) => state.setComposerDraft);
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );
  const activeTopicId = useAppSelector((state) => state.chat.activeTopicId);
  const sendMessage = useSendMessage();
  const previews = useMemo(
    () =>
      files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [files],
  );
  const canSend =
    Boolean(activeConversationId && activeTopicId) &&
    (Boolean(draft.trim()) || files.length > 0 || Boolean(gifUrl.trim())) &&
    !sendMessage.isPending;

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  useEffect(() => {
    return () => {
      if (stopTypingTimerRef.current) {
        clearTimeout(stopTypingTimerRef.current);
      }

      if (typingRef.current && activeConversationId && activeTopicId) {
        socketManager.stopTyping({
          conversationId: activeConversationId,
          topicId: activeTopicId,
        });
      }
    };
  }, [activeConversationId, activeTopicId]);

  const signalTyping = () => {
    if (!activeConversationId || !activeTopicId) {
      return;
    }

    if (!typingRef.current) {
      socketManager.startTyping({
        conversationId: activeConversationId,
        topicId: activeTopicId,
      });
      typingRef.current = true;
    }

    if (stopTypingTimerRef.current) {
      clearTimeout(stopTypingTimerRef.current);
    }

    stopTypingTimerRef.current = setTimeout(() => {
      socketManager.stopTyping({
        conversationId: activeConversationId,
        topicId: activeTopicId,
      });
      typingRef.current = false;
    }, 1200);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();
    const normalizedGifUrl = gifUrl.trim();

    if (
      (!content && files.length === 0 && !normalizedGifUrl) ||
      !activeConversationId ||
      !activeTopicId
    ) {
      return;
    }

    const payload: SendMessagePayload = {
      conversationId: activeConversationId,
      topicId: activeTopicId,
      content: normalizedGifUrl ? content || normalizedGifUrl : content,
      type: normalizedGifUrl ? 4 : undefined,
      metadata: normalizedGifUrl ? { gifUrl: normalizedGifUrl } : undefined,
    };

    if (files.length > 0) {
      payload.files = files;
    }

    await sendMessage.mutateAsync(payload);

    if (typingRef.current) {
      socketManager.stopTyping({
        conversationId: activeConversationId,
        topicId: activeTopicId,
      });
      typingRef.current = false;
    }

    setDraft("");
    setGifUrl("");
    setGifOpen(false);
    setFiles([]);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex shrink-0 flex-col gap-2 border-t bg-background p-3"
    >
      {previews.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {previews.map((preview, index) => (
            <div
              key={`${preview.file.name}-${preview.file.lastModified}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted"
            >
              {preview.file.type.startsWith("video/") ? (
                <video
                  src={preview.url}
                  className="h-full w-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={preview.url}
                  alt={preview.file.name}
                  className="h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                aria-label="Remove attachment"
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/70 text-white"
                onClick={() =>
                  setFiles((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {gifOpen ? (
        <div className="flex items-center gap-2 rounded-xl border bg-[var(--dove-cream)] p-2">
          <ImagePlay className="size-4 shrink-0 text-[var(--dove-primary)]" />
          <input
            value={gifUrl}
            onChange={(event) => setGifUrl(event.target.value)}
            placeholder="Dan URL GIF..."
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--dove-primary-light)]"
          />
          <button
            type="button"
            aria-label="Close GIF input"
            className="grid size-8 place-items-center rounded-full text-[var(--dove-primary)]"
            onClick={() => {
              setGifOpen(false);
              setGifUrl("");
            }}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_MESSAGE_MEDIA}
          multiple
          className="hidden"
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);

            setFiles((current) =>
              [...current, ...selected].slice(0, MAX_ATTACHMENTS),
            );
            event.target.value = "";
          }}
        />

        <div className="hidden gap-1 sm:flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Attach"
            onClick={() => inputRef.current?.click()}
          >
            <Paperclip />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Emoji"
            onClick={() => setEmojiOpen((open) => !open)}
          >
            <Smile />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="Map">
            <MapPin />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="GIF"
            onClick={() => setGifOpen((open) => !open)}
          >
            <ImagePlay />
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Attach"
          className="sm:hidden"
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Emoji"
          className="sm:hidden"
          onClick={() => setEmojiOpen((open) => !open)}
        >
          <Smile />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="GIF"
          className="sm:hidden"
          onClick={() => setGifOpen((open) => !open)}
        >
          <ImagePlay />
        </Button>

        <Textarea
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            signalTyping();
          }}
          placeholder="Nhap tin nhan..."
          className="max-h-32 min-h-10 resize-none"
          rows={1}
          disabled={
            !activeConversationId || !activeTopicId || sendMessage.isPending
          }
        />

        <Button type="button" variant="ghost" size="icon" aria-label="Voice">
          <Mic />
        </Button>
        <Button
          type="submit"
          size="icon"
          aria-label="Send"
          disabled={!canSend}
        >
          <SendHorizontal />
        </Button>
      </div>

      {emojiOpen ? (
        <div className="absolute bottom-20 left-3 z-40 max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border bg-background shadow-xl">
          <EmojiPicker
            width={320}
            height={380}
            lazyLoadEmojis
            onEmojiClick={(emoji: EmojiClickData) => {
              setDraft(`${draft}${emoji.emoji}`);
              setEmojiOpen(false);
            }}
          />
        </div>
      ) : null}
    </form>
  );
}
