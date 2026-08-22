"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socketManager } from "@/modules/realtime/managers/socket-manager";

export function useFriendshipRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return socketManager.friendship.onUpdate(() => {
      void queryClient.invalidateQueries({
        queryKey: ["friendship"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["chat", "conversations"],
      });
    });
  }, [queryClient]);
}
