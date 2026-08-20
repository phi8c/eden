"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { Message } from "@/modules/chat/types/chat.types";
import { socketManager } from "../managers/socket-manager";

export function useConversationSocket(conversationId: number | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    socketManager.joinConversation(conversationId);

    return () => {
      socketManager.joinConversation(null);
    };
  }, [conversationId]);

  useEffect(() => {
    return socketManager.chat.onMessage((message) => {
      queryClient.setQueryData<Message[]>(
        ["chat", "messages", message.topicId],
        (current = []) => {
          if (current.some((item) => item.id === message.id)) {
            return current;
          }

          return [...current, message];
        },
      );

      void queryClient.invalidateQueries({
        queryKey: ["chat", "conversations"],
      });
    });
  }, [queryClient]);
}
