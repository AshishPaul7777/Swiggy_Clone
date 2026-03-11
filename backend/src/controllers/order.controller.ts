import { Request, Response } from "express"
import { createOrder } from "../services/order.service"

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const order = await createOrder(userId)

    res.json({
      message: "Order placed successfully",
      order
    })
  } catch (error) {
    res.status(400).json({ error: "Unable to place order" })
  }
}