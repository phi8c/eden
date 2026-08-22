import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processRefreshQueue(error: unknown, token?: string) {
  refreshQueue.forEach((subscriber) => {
    if (error || !token) {
      subscriber.reject(error);
      return;
    }

    subscriber.resolve(token);
  });

  refreshQueue = [];
}

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = window.localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url ?? "";

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const response = await refreshClient.post<{ access_token: string }>(
        "/auth/refresh",
      );
      const token = response.data.access_token;

      window.localStorage.setItem("access_token", token);
      processRefreshQueue(null, token);

      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      window.localStorage.removeItem("access_token");
      processRefreshQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
