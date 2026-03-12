import { Request, Response } from "express"
import { createPayment } from "../services/payment.service"

export const createPaymentController = async (
  req: Request,
  res: Response
) => {
  try {

    const { orderId, amount } = req.body

    const payment = await createPayment(orderId, amount)

    res.json({
      message: "Payment successful",
      payment
    })

  } catch (error) {

    res.status(500).json({
      message: "Payment failed"
    })
  }
}