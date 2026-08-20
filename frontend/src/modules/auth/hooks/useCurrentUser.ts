"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/modules/user/api/user.api";
import { useAuthStore } from "../stores/auth.store";

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useQuery({
    queryKey: ["auth", "current-user"],
    queryFn: async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      return user;
    },
    enabled: Boolean(accessToken),
    retry: false,
  });
}
