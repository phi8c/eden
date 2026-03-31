import { useState } from "react"
import { Card, message } from "antd"
import { useNavigate } from "react-router-dom"

import LoginForm from "../components/LoginForm"
import AuthService from "../services/authService"
import authStore from "../stores/authStore"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      setLoading(true)

      const res = await AuthService.login(data.email, data.password)

      // 🔥 lưu access token vào store
      authStore.setToken(res.access_token)


      localStorage.setItem("access_token", res.access_token)

      message.success("Login successful")

      navigate("/") // vào chat
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card title="Login" style={{ width: 400 }}>
        <LoginForm onSubmit={handleLogin} loading={loading} />
      </Card>
    </div>
  )
}