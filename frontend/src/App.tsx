import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from "react"

import ChatPage from "./modules/chat/pages/ChatPage"
import LoginPage from "./modules/auth/pages/LoginPage"

import AuthService from "./modules/auth/services/authService"
import authStore from "./modules/auth/stores/authStore"

export default function App() {

  // 🔥 auto login khi reload (dựa vào refresh token cookie)
  useEffect(() => {
    AuthService.refresh()
      .then((res) => {
        authStore.setToken(res.access_token)
      })
      .catch(() => {
        authStore.clear()
      })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}