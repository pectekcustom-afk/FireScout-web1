"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Shift } from "../types/user"

interface PostShiftModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: any) => void
  shift: Shift | null
}

export default function PostShiftModal({ isOpen, onClose, onSubmit, shift }: PostShiftModalProps) {
  const [formData, setFormData] = useState({
    watchCommander: "",
    teamCommand: "",
    callouts: "",
    additionalNotes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      callouts: Number.parseInt(formData.callouts) || 0,
      shiftId: shift?.id,
    })
    setFormData({
      watchCommander: "",
      teamCommand: "",
      callouts: "",
      additionalNotes: "",
    })
  }

  if (!shift) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>דוח סיום משמרת</DialogTitle>
          <DialogDescription>
            השלם את דוח המשמרת עבור {shift.station} בתאריך {new Date(shift.date).toLocaleDateString("he-IL")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="watchCommander">מפקד משמרת</Label>
            <Input
              id="watchCommander"
              value={formData.watchCommander}
              onChange={(e) => setFormData({ ...formData, watchCommander: e.target.value })}
              placeholder="הזן שם מפקד המשמרת"
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamCommand">מפקד צוות</Label>
            <Input
              id="teamCommand"
              value={formData.teamCommand}
              onChange={(e) => setFormData({ ...formData, teamCommand: e.target.value })}
              placeholder="הזן שם מפקד הצוות"
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="callouts">מספר קריאות</Label>
            <Input
              id="callouts"
              type="number"
              min="0"
              value={formData.callouts}
              onChange={(e) => setFormData({ ...formData, callouts: e.target.value })}
              placeholder="הזן מספר קריאות"
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">הערות נוספות (אופציונלי)</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="הערות או תצפיות נוספות..."
              rows={3}
              className="text-right"
            />
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">שלח דוח</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
