import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  acceptMapShareRequest,
  createMapShareRequest,
  endMapSession,
  rejectMapShareRequest,
} from "../api";
import type { MapShareDurationMinutes, MapShareSession } from "../types";

export function useMapSessionMutations(conversationId: number | null) {
  const queryClient = useQueryClient();

  const invalidateSession = () =>
    queryClient.invalidateQueries({
      queryKey: ["map-story", "conversation-session", conversationId],
    });
  const updateSession = (session: MapShareSession) => {
    queryClient.setQueryData(
      ["map-story", "conversation-session", conversationId],
      session,
    );
    invalidateSession();
  };

  const createRequest = useMutation({
    mutationFn: (durationMinutes: MapShareDurationMinutes) =>
      createMapShareRequest(conversationId as number, durationMinutes),
    onSuccess: updateSession,
  });

  const acceptRequest = useMutation({
    mutationFn: acceptMapShareRequest,
    onSuccess: updateSession,
  });

  const rejectRequest = useMutation({
    mutationFn: rejectMapShareRequest,
    onSuccess: updateSession,
  });

  const endSession = useMutation({
    mutationFn: endMapSession,
    onSuccess: updateSession,
  });

  return {
    createRequest,
    acceptRequest,
    rejectRequest,
    endSession,
  };
}
