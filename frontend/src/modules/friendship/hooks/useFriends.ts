"use client";

import { useQuery } from "@tanstack/react-query";

import { getFriends } from "../api/friendship.api";

export function useFriends() {
  return useQuery({
    queryKey: ["friendship", "friends"],
    queryFn: getFriends,
  });
}
