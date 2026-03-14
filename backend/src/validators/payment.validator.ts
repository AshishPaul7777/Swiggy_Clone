import { z } from "zod"

export const checkoutItemSchema = z.object({
  foodId: z.string().uuid(),
  quantity: z.number().int().positive()
})

export const createCheckoutOrderSchema = z.object({
  addressId: z.string().uuid(),
  items: z.array(checkoutItemSchema).min(1)
})

export const verifyPaymentSchema = z.object({
  appOrderId: z.string().uuid(),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1)
})
