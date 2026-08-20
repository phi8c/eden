"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser } from "@/modules/user/api/user.api";
import { login } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";
import type { LoginPayload } from "../types/auth.types";

export function useLogin() {
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const token = await login(payload);
      setAccessToken(token.access_token);

      const currentUser = await getCurrentUser();
      setCurrentUser(currentUser);
      queryClient.setQueryData(["auth", "current-user"], currentUser);

      return currentUser;
    },
  });
}
