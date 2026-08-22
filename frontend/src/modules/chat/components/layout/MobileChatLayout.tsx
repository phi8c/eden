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
    <div className="flex h-dvh flex-col bg-[var(--dove-cream)] lg:hidden">
      <div className="min-h-0 flex-1 overflow-hidden">
        {panel === "conversations" && <ChatSidebar variant="mobile" />}

        {panel === "chat" && (
          <div className="h-full min-h-0 bg-white">
            <ChatWindow />
          </div>
        )}

        {panel === "details" && (
          <div className="flex h-full min-h-0 flex-col bg-white">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[#F1DDCF] px-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Back"
                className="text-[var(--dove-primary)]"
                onClick={() => setPanel("chat")}
              >
                <ArrowLeft />
              </Button>
              <p className="text-sm font-semibold text-[var(--dove-text-dark)]">
                Details
              </p>
            </div>
            <div className="min-h-0 flex-1">
              <RightSidebar />
            </div>
          </div>
        )}
      </div>

      {panel === "conversations" && (
        <nav className="grid h-16 shrink-0 grid-cols-3 border-t border-[#F1DDCF] bg-[var(--dove-cream)] px-10 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = panel === item.key;

            return (
              <button
                key={item.key}
                type="button"
                className={cn(
                  "flex items-center justify-center rounded-2xl text-[var(--dove-primary-light)] transition",
                  active && "bg-white text-[var(--dove-primary)] shadow-sm",
                )}
                aria-label={item.label}
                onClick={() => setPanel(item.key)}
              >
                <Icon className="size-5" />
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
