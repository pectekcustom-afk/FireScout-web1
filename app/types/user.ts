export interface User {
  id: string
  name: string
  badge: string
  rank: string
  role: "admin" | "normal"
  email?: string
}

export interface Shift {
  id: string
  date: string
  startTime: string
  endTime: string
  station: string
  assignedOfficer?: string
  status: "available" | "requested" | "assigned" | "completed"
  requestedBy?: string
}

export interface ShiftRequest {
  name: string
  station: string
  date: string
  startTime: string
  endTime: string
}

export interface PostShiftReport {
  shiftId: string
  watchCommander: string
  teamCommand: string
  callouts: number
  additionalNotes?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
}

export const PREDEFINED_ACCOUNTS = [
  {
    badge: "MatZhir214",
    password: "525fire",
    user: {
      id: "admin1",
      name: "מפקד צופי אש מתן צבי הירש",
      badge: "MatZhir214",
      rank: "מפקד צופי אש",
      role: "admin" as const,
      email: "admin@firewatch.gov.il",
    },
  },
  {
    badge: "OshAdgo225",
    password: "5521fire",
    user: {
      id: "user1",
      name: "צופה אש אושאדגו",
      badge: "OshAdgo225",
      rank: "צופה אש",
      role: "normal" as const,
      email: "oshadgo@firewatch.gov.il",
    },
  },
]
