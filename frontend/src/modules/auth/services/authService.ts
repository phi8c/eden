import http from "../../../services/httpService"

class AuthService {
  async login(email: string, password: string) {
    const res = await http.post("/auth/login", { email, password })
    return res.data
  }

  async refresh() {
    const res = await http.post("/auth/refresh")
    return res.data
  }

  async logout() {
    await http.post("/auth/logout")
  }
}

export default new AuthService()