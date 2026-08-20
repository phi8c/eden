"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { socketManager } from "../managers/socket-manager";

export function useSocketConnection() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    socketManager.updateToken(accessToken);

    return () => {
      if (!accessToken) {
        socketManager.disconnect();
      }
    };
  }, [accessToken]);
}
