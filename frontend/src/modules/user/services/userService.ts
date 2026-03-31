import httpService from "../../../services/httpService"
import type { User } from "../models/User"

class UserService {
  // 🔥 lấy user hiện tại
  async getCurrentUser(): Promise<User> {
    return await httpService.get("/me")
  }

  // 🔥 lấy user theo id
  async getUserById(id: number): Promise<User> {
    return await httpService.get(`/users/${id}`)
  }

  // 🔥 update profile
  async updateProfile(data: {
    displayName?: string
    bio?: string
    avatarUrl?: string
  }): Promise<User> {
    return await httpService.put("/users/profile", data)
  }
}

const userService = new UserService()
export default userService