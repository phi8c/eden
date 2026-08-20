"use client";

import type { ReactNode } from "react";

import { AuthSessionProvider } from "@/modules/auth/components/AuthSessionProvider";
import { QueryProvider } from "./QueryProvider";
import { StoreProvider } from "@/store/provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <QueryProvider>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
