"use client"

import { useState } from "react"
import LoginPage from "./components/login-page"
import Dashboard from "./components/dashboard"
import type { User } from "./types/user"

export default function App() {
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}
