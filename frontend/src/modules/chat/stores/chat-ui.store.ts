"use client";

import { create } from "zustand";

type MobilePanel = "conversations" | "chat" | "details";
type ChatMode = "messages" | "map";

interface ChatUiState {
  leftCollapsed: boolean;
  mobilePanel: MobilePanel;
  chatMode: ChatMode;
  composerDraft: string;
  setLeftCollapsed: (value: boolean) => void;
  toggleLeftCollapsed: () => void;
  setMobilePanel: (panel: MobilePanel) => void;
  setChatMode: (mode: ChatMode) => void;
  setComposerDraft: (value: string) => void;
}

export const useChatUiStore = create<ChatUiState>((set) => ({
  leftCollapsed: false,
  mobilePanel: "conversations",
  chatMode: "messages",
  composerDraft: "",
  setLeftCollapsed: (value) => set({ leftCollapsed: value }),
  toggleLeftCollapsed: () =>
    set((state) => ({ leftCollapsed: !state.leftCollapsed })),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
  setChatMode: (mode) => set({ chatMode: mode }),
  setComposerDraft: (value) => set({ composerDraft: value }),
}));
