"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, FileText, Settings } from "lucide-react"
import type { Shift, User } from "../types/user"
import { NotificationService } from "../services/notification-service"
import { PREDEFINED_ACCOUNTS } from "../types/user"
import type { Notification } from "../types/user"

interface AdminPanelProps {
  shifts: Shift[]
  onUpdateShifts: (shifts: Shift[]) => void
  currentUser: User
  onAddNotification: (notification: Notification) => void
}

export default function AdminPanel({ shifts, onUpdateShifts, currentUser, onAddNotification }: AdminPanelProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const pendingRequests = shifts.filter((shift) => shift.status === "requested")
  const completedShifts = shifts.filter((shift) => shift.status === "completed")
  const activeShifts = shifts.filter((shift) => shift.status === "assigned")

  const approveRequest = async (shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId)
    if (!shift) return

    const updatedShifts = shifts.map((s) =>
      s.id === shiftId ? { ...s, status: "assigned" as const, assignedOfficer: s.requestedBy } : s,
    )
    onUpdateShifts(updatedShifts)

    // Send notification to officer
    const officerUser = PREDEFINED_ACCOUNTS.find((acc) => acc.user.name === shift.requestedBy)?.user
    if (officerUser) {
      const shiftDetails = `${shift.station} בתאריך ${new Date(shift.date).toLocaleDateString("he-IL")} (${shift.startTime}-${shift.endTime})`
      const notification = await NotificationService.notifyShiftApproval(officerUser, shiftDetails, true)
      onAddNotification(notification)
    }
  }

  const rejectRequest = async (shiftId: string) => {
    const shift = shifts.find((s) => s.id === shiftId)
    if (!shift) return

    const updatedShifts = shifts.filter((s) => s.id !== shiftId)
    onUpdateShifts(updatedShifts)

    // Send notification to officer
    const officerUser = PREDEFINED_ACCOUNTS.find((acc) => acc.user.name === shift.requestedBy)?.user
    if (officerUser) {
      const shiftDetails = `${shift.station} בתאריך ${new Date(shift.date).toLocaleDateString("he-IL")} (${shift.startTime}-${shift.endTime})`
      const notification = await NotificationService.notifyShiftApproval(officerUser, shiftDetails, false)
      onAddNotification(notification)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="destructive" className="text-sm">
          מפקד צופי אש
        </Badge>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900">לוח בקרה מפקד צופי אש</h2>
          <p className="text-gray-600">ניהול משמרות, צופי אש והגדרות מערכת</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Users className="h-4 w-4 ml-2" />
            סקירה
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Calendar className="h-4 w-4 ml-2" />
            בקשות ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="h-4 w-4 ml-2" />
            דוחות
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 ml-2" />
            הגדרות
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">סך הכל משמרות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shifts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">בקשות ממתינות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">משמרות פעילות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{activeShifts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">הושלמו</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedShifts.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">אין בקשות משמרת ממתינות</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((shift) => (
              <Card key={shift.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-2 space-x-reverse">
                      <Button
                        size="sm"
                        onClick={() => approveRequest(shift.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        אשר
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectRequest(shift.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        דחה
                      </Button>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-medium">{shift.requestedBy}</span>
                        <Badge variant="outline">בקשה</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>תחנה: {shift.station}</div>
                        <div>תאריך: {new Date(shift.date).toLocaleDateString("he-IL")}</div>
                        <div>
                          שעות: {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>דוחות משמרות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedShifts.length === 0 ? (
                  <p className="text-gray-500">אין משמרות שהושלמו עם דוחות</p>
                ) : (
                  completedShifts.map((shift) => (
                    <div key={shift.id} className="border-r-4 border-r-green-500 pr-4 py-2 text-right">
                      <div className="font-medium">{shift.assignedOfficer}</div>
                      <div className="text-sm text-gray-600">
                        {shift.station} • {new Date(shift.date).toLocaleDateString("he-IL")} • {shift.startTime}-
                        {shift.endTime}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        דוח הוגש
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות מערכת</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                ניהול תחנות
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                ניהול משתמשים
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                יומני מערכת
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                גיבוי נתונים
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
