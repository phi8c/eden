"use client";

import { useState } from "react";
import { Loader2, MapPinned, MessageCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveTopicId } from "@/store/slices/chatSlice";
import { ChatMapMode } from "@/modules/chat-map/components/ChatMapMode";
import { MapShareRequestDialog } from "@/modules/map-story/components";
import { useConversations } from "../../hooks/useConversations";
import { useTopics } from "../../hooks/useTopics";
import { useChatUiStore } from "../../stores/chat-ui.store";
import { ChatComposer } from "../composer/ChatComposer";
import { MessageList } from "../message/MessageList";
import { CreateTopicDialog } from "../topic/CreateTopicDialog";
import { MobileChatHeader } from "./MobileChatHeader";
import { getConversationDisplay } from "../../utils/conversation-display";

export function ChatWindow() {
  const [createTopicOpen, setCreateTopicOpen] = useState(false);
  const [topicPickerOpen, setTopicPickerOpen] = useState(false);
  const chatMode = useChatUiStore((state) => state.chatMode);
  const setChatMode = useChatUiStore((state) => state.setChatMode);
  const setMobilePanel = useChatUiStore((state) => state.setMobilePanel);
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );
  const activeTopicId = useAppSelector((state) => state.chat.activeTopicId);
  const { data: conversations = [] } = useConversations();
  const { data: topics = [], isLoading: isLoadingTopics } =
    useTopics(activeConversationId);
  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ??
    null;
  const activeConversationName = activeConversation
    ? getConversationDisplay(activeConversation, currentUserId).displayName
    : "Chua chon hoi thoai";
  const activeTopic =
    topics.find((topic) => topic.id === activeTopicId) ?? null;

  return (
    <section className="relative flex h-full min-h-0 flex-col bg-muted/30">
      <MobileChatHeader
        activeConversation={activeConversation}
        activeTopic={activeTopic}
        topics={topics}
        activeTopicId={activeTopicId}
        chatMode={chatMode}
        conversationId={activeConversationId}
        topicPickerOpen={topicPickerOpen}
        currentUserId={currentUserId}
        onBack={() => setMobilePanel("conversations")}
        onTopicPickerOpenChange={setTopicPickerOpen}
        onTopicSelect={(topicId) => dispatch(setActiveTopicId(topicId))}
        onToggleChatMode={() =>
          setChatMode(chatMode === "messages" ? "map" : "messages")
        }
        onCreateTopic={() => setCreateTopicOpen(true)}
      />

      <header className="hidden h-14 shrink-0 items-center justify-between gap-3 border-b bg-background px-3 lg:flex">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {activeConversationName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {activeTopicId
              ? `Dang trong ${activeTopic?.name ?? `topic #${activeTopicId}`}`
              : "Chon hoi thoai de bat dau"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={chatMode === "messages" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setChatMode("messages")}
          >
            <MessageCircle data-icon="inline-start" />
            Chat
          </Button>
          <Button
            type="button"
            variant={chatMode === "map" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setChatMode("map")}
          >
            <MapPinned data-icon="inline-start" />
            Map
          </Button>
          <MapShareRequestDialog conversationId={activeConversationId} />
        </div>
      </header>

      <div className="hidden h-11 shrink-0 items-center gap-2 border-b bg-background px-3 lg:flex">
        {isLoadingTopics && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Dang tai topic
          </div>
        )}

        {!isLoadingTopics && topics.length === 0 && (
          <p className="text-xs text-muted-foreground">Chua co topic</p>
        )}

        {topics.map((topic) => (
          <Button
            key={topic.id}
            type="button"
            variant={topic.id === activeTopicId ? "secondary" : "ghost"}
            size="sm"
            onClick={() => dispatch(setActiveTopicId(topic.id))}
          >
            {topic.name}
          </Button>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="New topic"
          onClick={() => setCreateTopicOpen(true)}
          disabled={!activeConversationId}
        >
          <Plus />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {chatMode === "messages" ? (
          <ScrollArea className="h-full">
            <MessageList topicId={activeTopicId} />
          </ScrollArea>
        ) : (
          <ChatMapMode conversationId={activeConversationId} />
        )}
      </div>

      <ChatComposer />

      <CreateTopicDialog
        conversationId={activeConversationId}
        open={createTopicOpen}
        onOpenChange={setCreateTopicOpen}
      />
    </section>
  );
}
