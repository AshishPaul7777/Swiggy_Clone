import { Request, Response } from "express"
import { ZodError } from "zod"
import { verifyCheckoutPayment } from "../services/order.service"
import { verifyPaymentSchema } from "../validators/payment.validator"

export const verifyPaymentController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.userId as string
    const payload = verifyPaymentSchema.parse(req.body)

    const order = await verifyCheckoutPayment(userId, payload)

    res.json({
      message: "Payment verified successfully",
      order
    })
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: error.issues[0]?.message ?? "Invalid payment verification payload"
      })
      return
    }

    res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to verify payment"
    })
  }
}
