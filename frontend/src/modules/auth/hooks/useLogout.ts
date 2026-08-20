"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { logout } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";

export function useLogout() {
  const queryClient = useQueryClient();
  const logoutLocal = useAuthStore((state) => state.logoutLocal);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      logoutLocal();
      queryClient.clear();
    },
  });
}
