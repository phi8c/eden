"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendMessage } from "../api/chat.api";
import type { SendMessagePayload } from "../types/chat.types";
import { appendMessageToQueryCache } from "../utils/message-cache";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: (message) => {
      appendMessageToQueryCache(queryClient, message);

      void queryClient.invalidateQueries({
        queryKey: ["chat", "conversations"],
      });
    },
  });
}
