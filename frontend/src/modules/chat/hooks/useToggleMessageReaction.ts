"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleMessageReaction } from "../api/chat.api";
import { updateMessageReactionsInQueryCache } from "../utils/message-cache";

export function useToggleMessageReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleMessageReaction,
    onSuccess: (payload) => {
      updateMessageReactionsInQueryCache(queryClient, payload);
    },
  });
}
