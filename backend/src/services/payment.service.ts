import { db } from "../db"
import { payments } from "../db/schema"

export async function createPayment(orderId: string, amount: number) {

  const payment = await db.insert(payments).values({
    orderId,
    amount,
    paymentMethod: "COD",
    paymentStatus: "SUCCESS"
  }).returning()

  return payment[0]
}