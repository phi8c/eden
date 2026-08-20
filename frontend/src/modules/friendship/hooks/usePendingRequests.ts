"use client";

import { useQuery } from "@tanstack/react-query";

import { getPendingRequests } from "../api/friendship.api";

export function usePendingRequests() {
  return useQuery({
    queryKey: ["friendship", "pending"],
    queryFn: getPendingRequests,
  });
}
