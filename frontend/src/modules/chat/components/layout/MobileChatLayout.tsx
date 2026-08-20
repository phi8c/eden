"use client";

import { ArrowLeft, Info, MessageCircle, PanelLeft, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatUiStore } from "../../stores/chat-ui.store";
import { ChatSidebar } from "./ChatSidebar";
import { ChatWindow } from "./ChatWindow";
import { RightSidebar } from "./RightSidebar";

const navItems = [
  {
    key: "conversations" as const,
    label: "Chats",
    icon: MessageCircle,
  },
  {
    key: "chat" as const,
    label: "Room",
    icon: PanelLeft,
  },
  {
    key: "details" as const,
    label: "Info",
    icon: Info,
  },
];

export function MobileChatLayout() {
  const panel = useChatUiStore((state) => state.mobilePanel);
  const setPanel = useChatUiStore((state) => state.setMobilePanel);

  return (
    <div className="flex h-dvh flex-col bg-background lg:hidden">
      <div className="min-h-0 flex-1 overflow-hidden">
        {panel === "conversations" && <ChatSidebar />}

        {panel === "chat" && (
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Back"
                onClick={() => setPanel("conversations")}
              >
                <ArrowLeft />
              </Button>
              <p className="text-sm font-semibold">Chat</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Details"
                className="ml-auto"
                onClick={() => setPanel("details")}
              >
                <Users />
              </Button>
            </div>
            <div className="min-h-0 flex-1">
              <ChatWindow />
            </div>
          </div>
        )}

        {panel === "details" && (
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Back"
                onClick={() => setPanel("chat")}
              >
                <ArrowLeft />
              </Button>
              <p className="text-sm font-semibold">Details</p>
            </div>
            <div className="min-h-0 flex-1">
              <RightSidebar />
            </div>
          </div>
        )}
      </div>

      <nav className="grid h-14 shrink-0 grid-cols-3 border-t bg-background">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = panel === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground transition",
                active && "text-foreground",
              )}
              onClick={() => setPanel(item.key)}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
