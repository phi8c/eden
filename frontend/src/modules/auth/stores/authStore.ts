import { makeAutoObservable } from "mobx"

export interface User {
  id: number
  email: string
  username?: string
}

class AuthStore {
  accessToken: string | null = null
  user: User | null = null

  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  // 🔥 INIT khi reload
  init() {
    const token = localStorage.getItem("access_token")

    if (token) {
      this.accessToken = token
    }
  }

  // 🔥 SET FULL AUTH
  setAuth(token: string, user: User) {
    this.accessToken = token
    this.user = user

    localStorage.setItem("access_token", token)
  }

  // 🔥 chỉ set token (fallback)
  setToken(token: string) {
    this.accessToken = token
    localStorage.setItem("access_token", token)
  }

  // 🔥 set user riêng (khi gọi /me)
  setUser(user: User) {
    this.user = user
  }

  // 🔥 logout
  logout() {
    this.accessToken = null
    this.user = null

    localStorage.removeItem("access_token")
  }

  // 🔥 computed
  get isAuthenticated() {
    return !!this.accessToken
  }

  get currentUserId() {
    return this.user?.id
  }
}

const authStore = new AuthStore()
export default authStore