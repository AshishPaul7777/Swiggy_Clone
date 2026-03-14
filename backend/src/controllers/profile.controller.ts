import { Request, Response } from "express"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { users } from "../db/schema"
import {
  createAddress,
  deleteAddress,
  getAddressesByUserId,
  getOrdersByUserId,
  getProfileByUserId,
  updateAddress,
  updateProfileByUserId
} from "../services/profile.service"
import { addressSchema, updateProfileSchema } from "../validators/profile.validator"

async function getOrdersSafely(userId: string) {
  try {
    return await getOrdersByUserId(userId)
  } catch (error) {
    console.error("Unable to load order history for profile:", error)
    return []
  }
}

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string
  const profile = await getProfileByUserId(userId)
  const userAddresses = await getAddressesByUserId(userId)
  const userOrders = await getOrdersSafely(userId)

  res.json({
    user: profile,
    addresses: userAddresses,
    orders: userOrders
  })
}

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string
  const data = updateProfileSchema.parse(req.body)

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))

  const duplicateUser = existingUser.find((user) => user.id !== userId)

  if (duplicateUser) {
    return res.status(400).json({
      message: "Email already in use"
    })
  }

  const profile = await updateProfileByUserId(userId, data)
  const userAddresses = await getAddressesByUserId(userId)
  const userOrders = await getOrdersSafely(userId)

  res.json({
    message: "Profile updated successfully",
    user: profile,
    addresses: userAddresses,
    orders: userOrders
  })
}

export const addAddress = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string
  const data = addressSchema.parse(req.body)

  const address = await createAddress(userId, data)

  res.status(201).json({
    message: "Address added successfully",
    address
  })
}

export const editAddress = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string
  const addressId = req.params.id as string
  const data = addressSchema.parse(req.body)

  const address = await updateAddress(userId, addressId, data)

  if (!address) {
    return res.status(404).json({
      message: "Address not found"
    })
  }

  res.json({
    message: "Address updated successfully",
    address
  })
}

export const removeAddress = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string
  const addressId = req.params.id as string

  const address = await deleteAddress(userId, addressId)

  if (!address) {
    return res.status(404).json({
      message: "Address not found"
    })
  }

  res.json({
    message: "Address removed successfully"
  })
}
