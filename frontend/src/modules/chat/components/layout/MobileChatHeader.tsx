"use client";

import {
  ArrowLeft,
  ChevronDown,
  MapPinned,
  MessageCircle,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MapShareStatusBar } from "@/modules/map-story/components/MapShareStatusBar";
import type { Conversation, Topic } from "../../types/chat.types";
import { getConversationDisplay } from "../../utils/conversation-display";

interface MobileChatHeaderProps {
  activeConversation: Conversation | null;
  activeTopic: Topic | null;
  topics: Topic[];
  activeTopicId: number | null;
  chatMode: "messages" | "map";
  conversationId: number | null;
  topicPickerOpen: boolean;
  currentUserId?: number | null;
  onBack: () => void;
  onTopicPickerOpenChange: (open: boolean) => void;
  onTopicSelect: (topicId: number) => void;
  onToggleChatMode: () => void;
  onCreateTopic: () => void;
}

export function MobileChatHeader({
  activeConversation,
  activeTopic,
  topics,
  activeTopicId,
  chatMode,
  conversationId,
  topicPickerOpen,
  currentUserId,
  onBack,
  onTopicPickerOpenChange,
  onTopicSelect,
  onToggleChatMode,
  onCreateTopic,
}: MobileChatHeaderProps) {
  const conversationName = activeConversation
    ? getConversationDisplay(activeConversation, currentUserId).displayName
    : "Chua chon hoi thoai";
  const topicName = activeTopic?.name ?? "Chon topic";
  const ModeIcon = chatMode === "messages" ? MapPinned : MessageCircle;

  return (
    <header className="relative z-30 shrink-0 border-b border-[#F1DDCF] bg-[var(--dove-cream)] px-3 py-2 text-[var(--dove-text-dark)] lg:hidden">
      <div className="flex h-10 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Back"
          className="shrink-0 text-[var(--dove-primary)] hover:bg-white/70 hover:text-[var(--dove-primary)]"
          onClick={onBack}
        >
          <ArrowLeft />
        </Button>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--dove-text-dark)]">
          {conversationName}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={chatMode === "messages" ? "Switch to map" : "Switch to chat"}
          className="shrink-0 rounded-full bg-[var(--dove-primary)] text-white shadow-sm hover:bg-[var(--dove-primary)] hover:text-white"
          onClick={onToggleChatMode}
          disabled={!activeConversation}
        >
          <ModeIcon />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="New topic"
          className="shrink-0 rounded-full bg-white text-[var(--dove-primary)] shadow-sm ring-1 ring-[#F1DDCF] hover:bg-white hover:text-[var(--dove-primary)]"
          onClick={onCreateTopic}
          disabled={!activeConversation}
        >
          <Plus />
        </Button>
      </div>

      <div className="mt-2 flex h-10 items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-[38%] min-w-0 items-center gap-2 rounded-full bg-white px-3 text-left shadow-sm ring-1 ring-[#F1DDCF]"
          onClick={() => onTopicPickerOpenChange(!topicPickerOpen)}
          disabled={!activeConversation}
        >
          <div className="min-w-0 flex-1 overflow-hidden">
            <span
              className={cn(
                "block whitespace-nowrap text-xs font-semibold text-[var(--dove-text-dark)]",
                topicName.length > 16 && "dove-marquee",
              )}
            >
              {topicName}
            </span>
          </div>
          <ChevronDown className="size-4 shrink-0 text-[var(--dove-primary)]" />
        </button>

        <MapShareStatusBar
          conversationId={conversationId}
          currentUserId={currentUserId}
        />
      </div>

      {topicPickerOpen && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-[#F1DDCF] bg-white px-3 py-3 shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {topics.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-[var(--dove-text-gray)]">
                Chua co topic
              </p>
            ) : (
              <div className="grid gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className={cn(
                      "rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[var(--dove-text-dark)] transition",
                      topic.id === activeTopicId
                        ? "bg-[var(--dove-cream)] text-[var(--dove-primary)]"
                        : "bg-[#FAFAFA] hover:bg-[var(--dove-cream)]",
                    )}
                    onClick={() => {
                      onTopicSelect(topic.id);
                      onTopicPickerOpenChange(false);
                    }}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
