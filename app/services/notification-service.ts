import type { User, Notification } from "../types/user"

export class NotificationService {
  static async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Simulate email sending
    console.log("📧 אימייל נשלח:")
    console.log(`אל: ${to}`)
    console.log(`נושא: ${subject}`)
    console.log(`תוכן: ${body}`)
    console.log("---")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return true
  }

  static createNotification(
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
  ): Notification {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    }
  }

  static async notifyShiftRequest(adminUser: User, officerName: string, shiftDetails: string) {
    const subject = "בקשת משמרת חדשה ממתינה לאישור"
    const body = `
שלום ${adminUser.name},

בקשת משמרת חדשה הוגשה ודורשת את אישורך.

צופה אש: ${officerName}
פרטי המשמרת: ${shiftDetails}

אנא התחבר למערכת כדי לבדוק ולאשר/לדחות את הבקשה.

בברכה,
מערכת ניהול משמרות צופי אש
  `

    await this.sendEmail(adminUser.email || "", subject, body)

    return this.createNotification("בקשת משמרת חדשה", `${officerName} ביקש משמרת. לחץ על פאנל מפקד לבדיקה.`, "info")
  }

  static async notifyShiftApproval(officerUser: User, shiftDetails: string, approved: boolean) {
    const status = approved ? "אושרה" : "נדחתה"
    const subject = `בקשת משמרת ${status}`
    const body = `
שלום ${officerUser.name},

בקשת המשמרת שלך ${status}.

פרטי המשמרת: ${shiftDetails}

${
  approved
    ? "הוקצתה לך המשמרת. אנא הגע בזמן והשלם את דוח סיום המשמרת."
    : "אנא פנה למפקד שלך אם יש לך שאלות לגבי החלטה זו."
}

בברכה,
מערכת ניהול משמרות צופי אש
    `

    await this.sendEmail(officerUser.email || "", subject, body)

    return this.createNotification(
      `בקשת משמרת ${status}`,
      `בקשת המשמרת שלך עבור ${shiftDetails} ${status}.`,
      approved ? "success" : "warning",
    )
  }
}
