"use client";

import { create } from "zustand";

import type { CurrentUserResponse } from "@/modules/user/types/user.types";

interface AuthState {
  accessToken: string | null;
  currentUser: CurrentUserResponse | null;
  isBootstrapping: boolean;
  setAccessToken: (token: string | null) => void;
  setCurrentUser: (user: CurrentUserResponse | null) => void;
  setIsBootstrapping: (value: boolean) => void;
  logoutLocal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  currentUser: null,
  isBootstrapping: true,
  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        window.localStorage.setItem("access_token", token);
      } else {
        window.localStorage.removeItem("access_token");
      }
    }

    set({ accessToken: token });
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  setIsBootstrapping: (value) => set({ isBootstrapping: value }),
  logoutLocal: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
    }

    set({
      accessToken: null,
      currentUser: null,
      isBootstrapping: false,
    });
  },
}));

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("access_token");
}
