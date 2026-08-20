"use client";

import { FormEvent } from "react";
import { MapPin, Mic, Paperclip, SendHorizontal, Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/store/hooks";
import { useSendMessage } from "../../hooks/useSendMessage";
import { useChatUiStore } from "../../stores/chat-ui.store";

export function ChatComposer() {
  const draft = useChatUiStore((state) => state.composerDraft);
  const setDraft = useChatUiStore((state) => state.setComposerDraft);
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );
  const activeTopicId = useAppSelector((state) => state.chat.activeTopicId);
  const sendMessage = useSendMessage();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = draft.trim();

    if (!content || !activeConversationId || !activeTopicId) {
      return;
    }

    await sendMessage.mutateAsync({
      conversationId: activeConversationId,
      topicId: activeTopicId,
      content,
      type: 1,
    });

    setDraft("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-end gap-2 border-t bg-background p-3"
    >
      <div className="hidden gap-1 sm:flex">
        <Button type="button" variant="ghost" size="icon" aria-label="Attach">
          <Paperclip />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Emoji">
          <Smile />
        </Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Map">
          <MapPin />
        </Button>
      </div>

      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Nhap tin nhan..."
        className="max-h-32 min-h-10 resize-none"
        rows={1}
        disabled={!activeConversationId || !activeTopicId || sendMessage.isPending}
      />

      <Button type="button" variant="ghost" size="icon" aria-label="Voice">
        <Mic />
      </Button>
      <Button
        type="submit"
        size="icon"
        aria-label="Send"
        disabled={!draft.trim() || sendMessage.isPending}
      >
        <SendHorizontal />
      </Button>
    </form>
  );
}
