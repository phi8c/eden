"use client";

import { useQuery } from "@tanstack/react-query";

import { searchUsers } from "../api/friendship.api";

export function useUserSearch(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["friendship", "user-search", normalizedQuery],
    queryFn: () => searchUsers(normalizedQuery),
    enabled: normalizedQuery.length > 1,
  });
}
