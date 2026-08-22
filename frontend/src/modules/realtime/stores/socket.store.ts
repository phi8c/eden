"use client";

import { create } from "zustand";
import type { SocketStatus } from "../types/socket-events.types";

interface SocketState {
  status: SocketStatus;
  socketId: string | null;
  activeConversationId: number | null;
  joinedConversationId: number | null;
  lastError: string | null;
  setStatus: (status: SocketStatus) => void;
  setSocketId: (socketId: string | null) => void;
  setActiveConversationId: (conversationId: number | null) => void;
  setJoinedConversationId: (conversationId: number | null) => void;
  setLastError: (error: string | null) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  status: "idle",
  socketId: null,
  activeConversationId: null,
  joinedConversationId: null,
  lastError: null,
  setStatus: (status) => set({ status }),
  setSocketId: (socketId) => set({ socketId }),
  setActiveConversationId: (activeConversationId) =>
    set({ activeConversationId }),
  setJoinedConversationId: (joinedConversationId) =>
    set({ joinedConversationId }),
  setLastError: (lastError) => set({ lastError }),
}));
