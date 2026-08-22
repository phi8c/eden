"use client";

import { create } from "zustand";

type MobilePanel = "conversations" | "chat" | "details";
type ChatMode = "messages" | "map";

interface TypingUserState {
  userId: number;
  updatedAt: number;
}

interface ChatUiState {
  leftCollapsed: boolean;
  mobilePanel: MobilePanel;
  chatMode: ChatMode;
  composerDraft: string;
  typingByTopic: Record<number, Record<number, TypingUserState>>;
  setLeftCollapsed: (value: boolean) => void;
  toggleLeftCollapsed: () => void;
  setMobilePanel: (panel: MobilePanel) => void;
  setChatMode: (mode: ChatMode) => void;
  setComposerDraft: (value: string) => void;
  setTypingUser: (topicId: number, userId: number, typing: boolean) => void;
  pruneTypingUsers: (staleBefore: number) => void;
}

export const useChatUiStore = create<ChatUiState>((set) => ({
  leftCollapsed: false,
  mobilePanel: "conversations",
  chatMode: "messages",
  composerDraft: "",
  typingByTopic: {},
  setLeftCollapsed: (value) => set({ leftCollapsed: value }),
  toggleLeftCollapsed: () =>
    set((state) => ({ leftCollapsed: !state.leftCollapsed })),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
  setChatMode: (mode) => set({ chatMode: mode }),
  setComposerDraft: (value) => set({ composerDraft: value }),
  setTypingUser: (topicId, userId, typing) =>
    set((state) => {
      const topicTyping = {
        ...(state.typingByTopic[topicId] ?? {}),
      };

      if (typing) {
        topicTyping[userId] = {
          userId,
          updatedAt: Date.now(),
        };
      } else {
        delete topicTyping[userId];
      }

      return {
        typingByTopic: {
          ...state.typingByTopic,
          [topicId]: topicTyping,
        },
      };
    }),
  pruneTypingUsers: (staleBefore) =>
    set((state) => {
      const typingByTopic: ChatUiState["typingByTopic"] = {};

      Object.entries(state.typingByTopic).forEach(([topicId, users]) => {
        const activeUsers = Object.fromEntries(
          Object.entries(users).filter(
            ([, value]) => value.updatedAt >= staleBefore,
          ),
        );

        if (Object.keys(activeUsers).length > 0) {
          typingByTopic[Number(topicId)] = activeUsers;
        }
      });

      return { typingByTopic };
    }),
}));
