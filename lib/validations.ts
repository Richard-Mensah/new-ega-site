import { z } from "zod"

export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name is required"),
  role: z.enum(["participant", "mentor"]),
  country: z.string().min(1, "Please select your country"),
  bio: z.string().optional(),
  sdg_focus: z.array(z.number()),
})

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const ContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const ProjectSchema = z.object({
  title: z.string().min(3, "Project title is required"),
  sdg_number: z.number().min(1).max(17).nullable(),
  description: z.string().min(10, "Description is required"),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ContactInput = z.infer<typeof ContactSchema>
export type ProjectInput = z.infer<typeof ProjectSchema>
