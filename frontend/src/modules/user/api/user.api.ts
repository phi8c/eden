import { apiClient } from "@/lib/api/client";
import type { CurrentUserResponse } from "../types/user.types";

export async function getCurrentUser() {
  const response = await apiClient.get<CurrentUserResponse>("/users/me");
  return response.data;
}
