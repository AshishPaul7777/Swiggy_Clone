import { Request, Response } from "express"
import { ZodError } from "zod"
import { createCheckoutOrderSchema } from "../validators/payment.validator"
import { createCheckoutOrder } from "../services/order.service"

export const createCheckoutOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.userId as string
    const payload = createCheckoutOrderSchema.parse(req.body)

    const checkout = await createCheckoutOrder(
      userId,
      payload.addressId,
      payload.items
    )

    res.json({
      message: "Checkout order created successfully",
      ...checkout
    })
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: error.issues[0]?.message ?? "Invalid checkout payload"
      })
      return
    }

    res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to create checkout order"
    })
  }
}
