"use client";

import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getCurrentUser } from "@/modules/user/api/user.api";
import { refreshAccessToken } from "../api/auth.api";
import {
  getStoredAccessToken,
  useAuthStore,
} from "../stores/auth.store";

interface AuthSessionProviderProps {
  children: ReactNode;
}

export function AuthSessionProvider({
  children,
}: AuthSessionProviderProps) {
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setIsBootstrapping = useAuthStore(
    (state) => state.setIsBootstrapping,
  );
  const logoutLocal = useAuthStore((state) => state.logoutLocal);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const storedToken = getStoredAccessToken();

        if (storedToken) {
          setAccessToken(storedToken);

          try {
            const currentUser = await getCurrentUser();

            if (cancelled) {
              return;
            }

            setCurrentUser(currentUser);
            queryClient.setQueryData(["auth", "current-user"], currentUser);
            return;
          } catch {
            setAccessToken(null);
          }
        }

        const token = await refreshAccessToken();

        if (cancelled) {
          return;
        }

        setAccessToken(token.access_token);

        const currentUser = await getCurrentUser();

        if (cancelled) {
          return;
        }

        setCurrentUser(currentUser);
        queryClient.setQueryData(["auth", "current-user"], currentUser);
      } catch {
        if (!cancelled) {
          logoutLocal();
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [
    logoutLocal,
    queryClient,
    setAccessToken,
    setCurrentUser,
    setIsBootstrapping,
  ]);

  return children;
}
