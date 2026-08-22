import { useQuery } from "@tanstack/react-query";

import { getConversationMapSession } from "../api";

export function useMapSession(conversationId: number | null) {
  return useQuery({
    queryKey: ["map-story", "conversation-session", conversationId],
    queryFn: () => getConversationMapSession(conversationId as number),
    enabled: Boolean(conversationId),
    retry: false,
  });
}
