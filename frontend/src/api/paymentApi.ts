import { api } from "./axios"
import { useAuthStore } from "@/store/authStore"
import type { Address } from "./authApi"

const authHeaders = () => {
  const token = useAuthStore.getState().accessToken

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : undefined
}

export type CheckoutItemPayload = {
  foodId: string
  quantity: number
}

export type CreateCheckoutOrderPayload = {
  addressId: string
  items: CheckoutItemPayload[]
}

export type CreateCheckoutOrderResponse = {
  message: string
  order: {
    id: string
    addressId: string
    total: number
    currency: string
    status: string
    razorpayOrderId: string | null
  }
  razorpay: {
    keyId: string
    amount: number
    currency: string
    razorpayOrderId: string
  }
  address: Address
  lineItems: Array<{
    foodId: string
    name: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }>
}

export type VerifyPaymentPayload = {
  appOrderId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

export const createCheckoutOrder = async (
  payload: CreateCheckoutOrderPayload
) => {
  const res = await api.post<CreateCheckoutOrderResponse>(
    "/orders/checkout",
    payload,
    {
      headers: authHeaders()
    }
  )

  return res.data
}

export const verifyPayment = async (payload: VerifyPaymentPayload) => {
  const res = await api.post(
    "/payments/verify",
    payload,
    {
      headers: authHeaders()
    }
  )

  return res.data
}
