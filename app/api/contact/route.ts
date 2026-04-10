import { NextRequest, NextResponse } from "next/server"
import { ContactSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = ContactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const { name, email, subject, message } = parsed.data

    // Log the contact form submission (replace with email service or DB insert)
    console.log("Contact form submission:", { name, email, subject, message })

    // TODO: Integrate with email service (e.g., Resend, SendGrid)
    // or store in Supabase contact_requests table

    return NextResponse.json({ message: "Message received" }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
