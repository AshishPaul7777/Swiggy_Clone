import { api } from "./axios"
import { useAuthStore } from "@/store/authStore"

export type AuthResponse = {
  message: string
  accessToken: string
  user: {
    id: string
    name: string
    email: string
  }
}

export type Address = {
  id: string
  userId: string
  label: string
  line1: string
  line2?: string | null
  city: string
  state: string
  postalCode: string
  landmark?: string | null
  isDefault: boolean
  createdAt?: string | null
}

export type OrderHistoryItem = {
  id: string
  total?: number | null
  currency: string
  status: string
  createdAt?: string | null
  addressId?: string | null
  addressLabel?: string | null
  paymentStatus?: string | null
  paymentMethod?: string | null
  razorpayPaymentId?: string | null
  items: Array<{
    id: string
    foodId: string
    foodNameSnapshot: string
    foodImageSnapshot?: string | null
    unitPrice: number
    quantity: number
    lineTotal: number
  }>
}

export type ProfileResponse = {
  user: {
    id: string
    name: string
    email: string
    phone?: string | null
    avatar?: string | null
  }
  addresses: Address[]
  orders: OrderHistoryItem[]
}

export type ProfilePayload = {
  name: string
  email: string
  phone?: string
}

export type AddressPayload = {
  label: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  landmark?: string
  isDefault?: boolean
}

const authHeaders = () => {
  const token = useAuthStore.getState().accessToken

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : undefined
}

export const registerUser = async (payload: {
  name: string
  email: string
  password: string
}) => {
  const res = await api.post<AuthResponse>("/auth/register", payload)
  return res.data
}

export const loginUser = async (payload: {
  email: string
  password: string
}) => {
  const res = await api.post<AuthResponse>("/auth/login", payload)
  return res.data
}

export const refreshSession = async () => {
  const res = await api.post<AuthResponse>("/auth/refresh")
  return res.data
}

export const logoutUser = async () => {
  const res = await api.post("/auth/logout")
  return res.data
}

export const getProfile = async () => {
  const headers = authHeaders()

  if (!headers) {
    return null
  }

  const res = await api.get<ProfileResponse>("/profile", { headers })
  return res.data
}

export const updateProfile = async (payload: ProfilePayload) => {
  const res = await api.put<ProfileResponse>("/profile", payload, {
    headers: authHeaders()
  })

  return res.data
}

export const createAddress = async (payload: AddressPayload) => {
  const res = await api.post<{ message: string; address: Address }>(
    "/profile/addresses",
    payload,
    {
      headers: authHeaders()
    }
  )

  return res.data
}

export const editAddress = async (id: string, payload: AddressPayload) => {
  const res = await api.put<{ message: string; address: Address }>(
    `/profile/addresses/${id}`,
    payload,
    {
      headers: authHeaders()
    }
  )

  return res.data
}

export const deleteAddress = async (id: string) => {
  const res = await api.delete<{ message: string }>(`/profile/addresses/${id}`, {
    headers: authHeaders()
  })

  return res.data
}
