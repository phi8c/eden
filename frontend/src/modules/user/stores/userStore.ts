import { makeAutoObservable, runInAction } from "mobx"
import userService from "../services/userService"

import type { User } from "../models/User"

class UserStore {
  currentUser: User | null = null
  selectedUser: User | null = null
  loadingUserIds: Set<number> = new Set()
  users: Record<number, User> = {}

  isLoading = false



  getUser(id: number) {
  return this.users[id]
}

  constructor() {
    makeAutoObservable(this)
  }

  // ==============================
  // 🔥 CURRENT USER
  // ==============================
  async getCurrentUser() {
    this.isLoading = true

    try {
      const user = await userService.getCurrentUser()

      runInAction(() => {
        this.currentUser = user
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // ==============================
  // 🔥 GET USER BY ID
  // ==============================
async getUserById(id: number) {
  // 🔥 đã có → không gọi lại
  if (this.users[id]) return

  // 🔥 đang load → không gọi lại
  if (this.loadingUserIds.has(id)) return

  this.loadingUserIds.add(id)

  try {
    const user = await userService.getUserById(id)

    runInAction(() => {
      this.users[id] = user
    })
  } finally {
    runInAction(() => {
      this.loadingUserIds.delete(id)
    })
  }
}

  // ==============================
  // 🔥 UPDATE PROFILE
  // ==============================
  async updateProfile(data: {
    displayName?: string
    bio?: string
    avatarUrl?: string
  }) {
    this.isLoading = true

    try {
      const updated = await userService.updateProfile(data)

      runInAction(() => {
        this.currentUser = updated
      })
    } finally {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  // ==============================
  // 🔥 PRESENCE UPDATE (REALTIME READY)
  // ==============================
  updatePresence(userId: number, status: number) {
    if (this.currentUser?.id === userId) {
      this.currentUser.presence = {
        ...(this.currentUser.presence || {}),
        status,
      }
    }

    if (this.selectedUser?.id === userId) {
      this.selectedUser.presence = {
        ...(this.selectedUser.presence || {}),
        status,
      }
    }
  }
}

const userStore = new UserStore()
export default userStore