export interface UserProfile {
  displayName?: string
  bio?: string
  avatarUrl?: string
}

export interface UserSettings {
  theme?: number
  notificationsEnabled?: boolean
  language?: string
}

export interface UserPresence {
  status: number // 0 = offline, 1 = online
  lastSeen?: string
}

export interface User {
  id: number
  username: string
  email: string

  profile?: UserProfile
  settings?: UserSettings
  presence?: UserPresence

  createdAt?: string
}