import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional().or(z.literal(""))
})

export const addressSchema = z.object({
  label: z.string().min(2).max(50),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4).max(20),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional()
})
