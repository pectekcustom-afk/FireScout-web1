"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import type { User } from "../types/user"
import { PREDEFINED_ACCOUNTS } from "../types/user"

interface LoginPageProps {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [badge, setBadge] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Find matching account
    const account = PREDEFINED_ACCOUNTS.find((acc) => acc.badge === badge && acc.password === password)

    setTimeout(() => {
      if (account) {
        onLogin(account.user)
      } else {
        alert("פרטי התחברות שגויים. אנא בדוק את שם המשתמש והסיסמה.")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">מערכת ניהול משמרות</CardTitle>
          <CardDescription>
            הזן את פרטי ההתחברות שלך כדי לגשת ללוח המשמרות
            <div className="mt-2 text-xs text-gray-500">
              <div>מפקד: MatZhir214</div>
              <div>צופה אש: OshAdgo225</div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="badge">שם משתמש</Label>
              <Input
                id="badge"
                type="text"
                placeholder="הזן שם משתמש"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                required
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                placeholder="הזן סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-right"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "מתחבר..." : "התחבר"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
