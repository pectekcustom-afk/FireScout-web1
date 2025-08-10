"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import type { Notification } from "../types/user"

interface NotificationPopupProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export default function NotificationPopup({ notifications, onDismiss }: NotificationPopupProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.read)
    setVisibleNotifications(unreadNotifications.slice(-3)) // Show last 3 notifications
  }, [notifications])

  // Auto-dismiss notifications after 4 seconds
  useEffect(() => {
    visibleNotifications.forEach((notification) => {
      const timer = setTimeout(() => {
        onDismiss(notification.id)
      }, 4000) // 4 seconds

      return () => clearTimeout(timer)
    })
  }, [visibleNotifications, onDismiss])

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-r-green-500"
      case "error":
        return "border-r-red-500"
      case "warning":
        return "border-r-yellow-500"
      default:
        return "border-r-blue-500"
    }
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-4 left-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={`border-r-4 ${getBorderColor(notification.type)} shadow-lg animate-in slide-in-from-left duration-300`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <Button variant="ghost" size="sm" onClick={() => onDismiss(notification.id)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-start space-x-3 space-x-reverse">
                {getIcon(notification.type)}
                <div className="flex-1 text-right">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notification.timestamp.toLocaleTimeString("he-IL")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
