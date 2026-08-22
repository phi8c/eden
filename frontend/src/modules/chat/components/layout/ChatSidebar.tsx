"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { FriendSearch } from "@/modules/friendship/components/FriendSearch";
import { ConversationList } from "../conversation/ConversationList";

const messageStatusFilters = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const messageTagFilters = [
  { value: "friends", label: "Bạn bè" },
  { value: "family", label: "Gia đình" },
  { value: "work", label: "Công việc" },
];

interface ChatSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  variant?: "desktop" | "mobile";
}

export function ChatSidebar({
  collapsed = false,
  onToggle,
  variant = "desktop",
}: ChatSidebarProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const mobile = variant === "mobile";
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(messageStatusFilters[0]);
  const [tagFilter, setTagFilter] = useState(messageTagFilters[0]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  if (mobile) {
    return (
      <aside className="flex h-full min-h-0 flex-col bg-[var(--dove-cream)]">
        <header className="relative grid h-16 shrink-0 grid-cols-4 items-center gap-2 px-4">
          <div
            className={cn(
              "flex h-10 min-w-10 items-center overflow-hidden rounded-full bg-[var(--dove-primary)] text-white shadow-sm transition-all duration-300 ease-out",
              searchOpen
                ? "absolute left-4 right-16 top-1/2 z-20 -translate-y-1/2 px-3"
                : "relative w-10 justify-self-start px-0",
            )}
          >
            <button
              type="button"
              aria-label="Search"
              className="grid size-10 shrink-0 place-items-center text-white"
              onClick={() => {
                setSearchOpen(true);
                setStatusOpen(false);
                setTagOpen(false);
              }}
            >
              <Search className="size-5" />
            </button>
            <input
              ref={searchInputRef}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onBlur={() => setSearchOpen(false)}
              placeholder="Tìm kiếm"
              className={cn(
                "h-full min-w-0 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/75 transition-opacity",
                searchOpen ? "w-full opacity-100" : "w-0 opacity-0",
              )}
            />
          </div>

          <div className={cn("relative justify-self-center", searchOpen && "invisible")}>
            <div className="relative">
              <button
                type="button"
                className="flex h-10 min-w-[76px] items-center justify-center gap-1 rounded-full bg-white/70 px-3 text-sm font-semibold text-[var(--dove-text-dark)] shadow-sm"
                onClick={() => {
                  setStatusOpen((open) => !open);
                  setTagOpen(false);
                }}
              >
                <span>{statusFilter.label}</span>
                <ChevronDown className="size-4 text-[var(--dove-primary)]" />
              </button>
              {statusOpen && (
                <div className="absolute left-0 top-12 z-20 w-32 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-[#F1DDCF]">
                  {messageStatusFilters.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      className={cn(
                        "block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[var(--dove-text-dark)]",
                        filter.value === statusFilter.value &&
                          "bg-[var(--dove-cream)] text-[var(--dove-primary)]",
                      )}
                      onClick={() => {
                        setStatusFilter(filter);
                        setStatusOpen(false);
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={cn("relative min-w-0 justify-self-center", searchOpen && "invisible")}>
              <button
                type="button"
                className="flex h-10 max-w-[104px] items-center justify-center gap-1 rounded-full bg-white/70 px-3 text-sm font-semibold text-[var(--dove-text-dark)] shadow-sm"
                onClick={() => {
                  setTagOpen((open) => !open);
                  setStatusOpen(false);
                }}
              >
                <span className="truncate">{tagFilter.label}</span>
                <ChevronDown className="size-4 shrink-0 text-[var(--dove-primary)]" />
              </button>
              {tagOpen && (
                <div className="absolute left-0 top-12 z-20 w-36 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-[#F1DDCF]">
                  {messageTagFilters.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      className={cn(
                        "block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[var(--dove-text-dark)]",
                        filter.value === tagFilter.value &&
                          "bg-[var(--dove-cream)] text-[var(--dove-primary)]",
                      )}
                      onClick={() => {
                        setTagFilter(filter);
                        setTagOpen(false);
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="justify-self-end rounded-full text-[var(--dove-text-dark)] hover:bg-white/70 hover:text-[var(--dove-primary)]"
          >
            <Bell className="size-5" />
          </Button>
        </header>

        <ScrollArea className="min-h-0 flex-1 rounded-t-[30px] bg-white">
          <ConversationList variant="mobile" />
        </ScrollArea>
      </aside>
    );
  }

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-[#F1DDCF] bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[#F1DDCF] bg-[var(--dove-cream)] px-3">
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--dove-text-dark)]">
              {currentUser?.user.username ?? "Eden"}
            </p>
            <p className="truncate text-xs text-[var(--dove-text-gray)]">
              {currentUser?.user.email ?? "Dang tai profile"}
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="ml-auto text-[var(--dove-primary)] hover:bg-white/70 hover:text-[var(--dove-primary)]"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </header>

      {!collapsed && (
        <div className="border-b border-[#F1DDCF] p-3">
          <FriendSearch />
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <MessageCircle className="size-3.5" />
              Conversations
            </div>
          )}
          <ConversationList collapsed={collapsed} />
        </div>
      </ScrollArea>
    </aside>
  );
}
