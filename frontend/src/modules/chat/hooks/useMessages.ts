"use client";

import { useQuery } from "@tanstack/react-query";

import { getMessages } from "../api/chat.api";

export function useMessages(topicId: number | null) {
  return useQuery({
    queryKey: ["chat", "messages", topicId],
    queryFn: () => getMessages(topicId as number),
    enabled: Boolean(topicId),
  });
}
