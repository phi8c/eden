import type { CurrentUserResponse } from "@/modules/user/types/user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
}

export type AuthUser = CurrentUserResponse;
