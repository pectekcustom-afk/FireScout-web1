"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, LogOut, Plus, Clock, MapPin, UserIcon } from "lucide-react"
import type { User, Shift, Notification } from "../types/user"
import ShiftCalendar from "./shift-calendar"
import RequestShiftModal from "./request-shift-modal"
import PostShiftModal from "./post-shift-modal"
import AdminPanel from "./admin-panel"
import NotificationPopup from "./notification-popup"
import { NotificationService } from "../services/notification-service"
import { PREDEFINED_ACCOUNTS } from "../types/user"

interface DashboardProps {
  user: User
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showPostShiftModal, setShowPostShiftModal] = useState(false)
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: "1",
      date: "2024-01-15",
      startTime: "06:00",
      endTime: "14:00",
      station: "תחנה א'",
      status: "available",
    },
    {
      id: "2",
      date: "2024-01-15",
      startTime: "14:00",
      endTime: "22:00",
      station: "תחנה ב'",
      status: "assigned",
      assignedOfficer: "שוטר כהן",
    },
    {
      id: "3",
      date: "2024-01-16",
      startTime: "22:00",
      endTime: "06:00",
      station: "תחנה א'",
      status: "requested",
      requestedBy: "שוטר לוי",
    },
  ])
  const [notifications, setNotifications] = useState<Notification[]>([])

  const handleRequestShift = async (request: any) => {
    const newShift: Shift = {
      id: Date.now().toString(),
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      station: request.station,
      status: "requested",
      requestedBy: user.name,
    }
    setShifts([...shifts, newShift])
    setShowRequestModal(false)

    // Send notification to admin
    const adminUser = PREDEFINED_ACCOUNTS.find((acc) => acc.user.role === "admin")?.user
    if (adminUser) {
      const shiftDetails = `${request.station} בתאריך ${new Date(request.date).toLocaleDateString("he-IL")} (${request.startTime}-${request.endTime})`
      const notification = await NotificationService.notifyShiftRequest(adminUser, user.name, shiftDetails)

      // Add notification to state (in real app, this would be sent to admin's session)
      setNotifications((prev) => [...prev, notification])
    }
  }

  const handleCompleteShift = (shift: Shift) => {
    setSelectedShift(shift)
    setShowPostShiftModal(true)
  }

  const handlePostShiftReport = (report: any) => {
    if (selectedShift) {
      setShifts(
        shifts.map((shift) => (shift.id === selectedShift.id ? { ...shift, status: "completed" as const } : shift)),
      )
    }
    setShowPostShiftModal(false)
    setSelectedShift(null)
  }

  const isAdmin = user.role === "admin"
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">ניהול משמרות צופי אש</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <UserIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <Badge variant="secondary">{user.badge}</Badge>
                <Badge variant={isAdmin ? "destructive" : "default"}>
                  {user.role === "admin" ? "מפקד צופי אש" : "צופה אש"}
                </Badge>
              </div>
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => setShowAdminPanel(!showAdminPanel)} className="ml-2">
                  {showAdminPanel ? "לוח בקרה" : "פאנל מנהל"}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                התנתק
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAdminPanel && isAdmin ? (
          <AdminPanel
            shifts={shifts}
            onUpdateShifts={setShifts}
            currentUser={user}
            onAddNotification={(notification) => setNotifications((prev) => [...prev, notification])}
          />
        ) : (
          <>
            {/* Existing dashboard content */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">לוח משמרות צופי אש</h2>
                <p className="text-gray-600">צפה ובקש משמרות זמינות</p>
              </div>
              <Button onClick={() => setShowRequestModal(true)}>
                <Plus className="h-4 w-4 ml-2" />
                בקש משמרת
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">משמרות זמינות</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shifts.filter((s) => s.status === "available").length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">הבקשות שלי</CardTitle>
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shifts.filter((s) => s.requestedBy === user.name).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">משמרות מוקצות</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {shifts.filter((s) => s.assignedOfficer === user.name).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar */}
            <ShiftCalendar shifts={shifts} user={user} onCompleteShift={handleCompleteShift} />
          </>
        )}
      </main>

      {/* Modals */}
      <RequestShiftModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleRequestShift}
      />

      <PostShiftModal
        isOpen={showPostShiftModal}
        onClose={() => setShowPostShiftModal(false)}
        onSubmit={handlePostShiftReport}
        shift={selectedShift}
      />
      <NotificationPopup notifications={notifications} onDismiss={dismissNotification} />
    </div>
  )
}
