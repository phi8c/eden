import { apiClient } from "@/lib/api/client";
import type {
  AuthTokenResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types";

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthTokenResponse>(
    "/auth/login",
    payload,
  );

  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post("/auth/register", payload);
  return response.data;
}

export async function refreshAccessToken() {
  const response =
    await apiClient.post<AuthTokenResponse>("/auth/refresh");

  return response.data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}
