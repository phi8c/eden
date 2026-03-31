import axios from "axios"
import authStore from "../modules/auth/stores/authStore"
import AuthService from "../modules/auth/services/authService"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 🔥 để gửi cookie (refresh token)
})

// 🔁 trạng thái refresh
let isRefreshing = false
let queue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  queue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  queue = []
}

// 📌 REQUEST INTERCEPTOR
http.interceptors.request.use((config) => {
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

// 📌 RESPONSE INTERCEPTOR (AUTO REFRESH)
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // nếu 401 → thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject }) 
       }).then((token) => {
  if (token) {
    originalRequest.headers.Authorization = `Bearer ${token}`
  }
  return http(originalRequest)
})
      }

      isRefreshing = true

      try {
        const data = await AuthService.refresh()

        authStore.setToken(data.access_token)

        processQueue(null, data.access_token)

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`

        return http(originalRequest)
      } catch (err) {
        processQueue(err, null)

       authStore.logout()

        window.location.href = "/login"

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default http