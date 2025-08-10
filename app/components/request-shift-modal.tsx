"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface RequestShiftModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (request: any) => void
}

export default function RequestShiftModal({ isOpen, onClose, onSubmit }: RequestShiftModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    station: "",
    date: "",
    startTime: "",
    endTime: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      station: "",
      date: "",
      startTime: "",
      endTime: "",
    })
  }

  const stations = ["תחנה א'", "תחנה ב'", "תחנה ג'", "תחנה ד'"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>בקשת משמרת</DialogTitle>
          <DialogDescription>מלא את הטופס למטה כדי לבקש הקצאת משמרת חדשה.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם צופה האש</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="הזן את שמך המלא"
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="station">תחנה</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, station: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר תחנה" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">תאריך</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">שעת התחלה</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">שעת סיום</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">שלח בקשה</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
