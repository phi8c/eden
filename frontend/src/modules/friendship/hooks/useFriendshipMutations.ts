"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createConversation } from "@/modules/chat/api/chat.api";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  unfriend,
} from "../api/friendship.api";

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["friendship"],
      });
    },
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["friendship"],
      });
    },
  });
}

export function useRejectFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["friendship"],
      });
    },
  });
}

export function useUnfriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfriend,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["friendship"],
      });
    },
  });
}

export function useStartPrivateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: number) =>
      createConversation({
        type: "private",
        memberIds: [memberId],
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["chat", "conversations"],
      });
    },
  });
}
