"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendMessage } from "../api/chat.api";
import type { Message, SendMessagePayload } from "../types/chat.types";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: (message) => {
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
    },
  });
}
