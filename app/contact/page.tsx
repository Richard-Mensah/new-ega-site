import type { Metadata } from "next"
import ContactInfo from "@/components/features/contact/ContactInfo"
import ContactForm from "@/components/features/contact/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us | EGA Mentorship International",
  description: "Get in touch with EGA Mentorship International. We're here to answer your questions about our programs, mentorship, and how to get involved.",
}

export default function ContactPage() {
  return (
    <div className="bg-brand-bg min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Get in Touch</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            We&apos;d love to hear from you. Whether you have a question about our programs, want to become a mentor, or need help getting started.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
