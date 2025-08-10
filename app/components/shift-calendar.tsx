"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, UserIcon, CheckCircle } from "lucide-react"
import type { Shift, User } from "../types/user"

interface ShiftCalendarProps {
  shifts: Shift[]
  user: User
  onCompleteShift: (shift: Shift) => void
}

export default function ShiftCalendar({ shifts, user, onCompleteShift }: ShiftCalendarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "requested":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "זמינה"
      case "requested":
        return "מבוקשת"
      case "assigned":
        return "מוקצית"
      case "completed":
        return "הושלמה"
      default:
        return status
    }
  }

  const groupedShifts = shifts.reduce(
    (acc, shift) => {
      if (!acc[shift.date]) {
        acc[shift.date] = []
      }
      acc[shift.date].push(shift)
      return acc
    },
    {} as Record<string, Shift[]>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedShifts).map(([date, dayShifts]) => (
        <Card key={date}>
          <CardHeader>
            <CardTitle className="text-lg">
              {new Date(date).toLocaleDateString("he-IL", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dayShifts.map((shift) => (
                <Card key={shift.id} className="border-r-4 border-r-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {shift.assignedOfficer === user.name && shift.status === "assigned" && (
                          <Button size="sm" onClick={() => onCompleteShift(shift)} className="ml-2">
                            <CheckCircle className="h-4 w-4 ml-1" />
                            השלם
                          </Button>
                        )}
                      </div>
                      <Badge className={getStatusColor(shift.status)}>{getStatusText(shift.status)}</Badge>
                    </div>

                    <div className="space-y-2 text-right">
                      <div className="flex items-center text-sm text-gray-600 justify-end">
                        <span className="ml-2">
                          {shift.startTime} - {shift.endTime}
                        </span>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 justify-end">
                        <span className="ml-2">{shift.station}</span>
                        <MapPin className="h-4 w-4" />
                      </div>
                      {shift.assignedOfficer && (
                        <div className="flex items-center text-sm text-gray-600 justify-end">
                          <span className="ml-2">{shift.assignedOfficer}</span>
                          <UserIcon className="h-4 w-4" />
                        </div>
                      )}
                      {shift.requestedBy && shift.status === "requested" && (
                        <div className="flex items-center text-sm text-gray-600 justify-end">
                          <span className="ml-2">בקשה מ: {shift.requestedBy}</span>
                          <UserIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
