import { Request, Response } from "express"
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} from "../services/cart.service"

export const addItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId
  const { foodId, quantity } = req.body

  const item = await addToCart(userId, foodId, quantity)

  res.json(item)
}

export const getUserCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId

  const cart = await getCart(userId)

  res.json(cart)
}

export const updateItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId
  const { foodId, quantity } = req.body

  await updateCartItem(userId, foodId, quantity)

  res.json({ message: "Cart updated" })
}

export const removeItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId
  const { foodId } = req.body

  await removeCartItem(userId, foodId)

  res.json({ message: "Item removed" })
}