"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      void queryClient.invalidateQueries({
        queryKey: ["chat", "conversations"],
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
