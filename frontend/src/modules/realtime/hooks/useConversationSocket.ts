"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  appendMessageToQueryCache,
  updateMessageReactionsInQueryCache,
} from "@/modules/chat/utils/message-cache";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useChatUiStore } from "@/modules/chat/stores/chat-ui.store";
import { socketManager } from "../managers/socket-manager";

export function useConversationSocket(conversationId: number | null) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.currentUser?.user.id);
  const setTypingUser = useChatUiStore((state) => state.setTypingUser);
  const pruneTypingUsers = useChatUiStore((state) => state.pruneTypingUsers);

  useEffect(() => {
    socketManager.joinConversation(conversationId);

    return () => {
      socketManager.joinConversation(null);
    };
  }, [conversationId]);

  useEffect(() => {
    const cleanupMessage = socketManager.chat.onMessage((message) => {
      appendMessageToQueryCache(queryClient, message);

      void queryClient.invalidateQueries({
        queryKey: ["chat", "conversations"],
      });
    });

    const cleanupReaction = socketManager.chat.onReaction((payload) => {
      updateMessageReactionsInQueryCache(queryClient, payload);
    });

    const cleanupTyping = socketManager.chat.onTyping((payload) => {
      if (payload.userId === currentUserId) {
        return;
      }

      setTypingUser(payload.topicId, payload.userId, payload.typing);
    });

    return () => {
      cleanupMessage();
      cleanupReaction();
      cleanupTyping();
    };
  }, [currentUserId, queryClient, setTypingUser]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      pruneTypingUsers(Date.now() - 5000);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [pruneTypingUsers]);
}
