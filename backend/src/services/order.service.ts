import { db } from "../db"
import { orders, cartItems, foodItems } from "../db/schema"
import { eq } from "drizzle-orm"

export async function createOrder(userId: string) {
  const cart = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))

  if (cart.length === 0) {
    throw new Error("Cart is empty")
  }

  let total = 0

  for (const item of cart) {
    const food = await db
      .select()
      .from(foodItems)
      .where(eq(foodItems.id, item.foodId))

    total += food[0].price * item.quantity
  }

  const order = await db
    .insert(orders)
    .values({
      userId,
      total
    })
    .returning()

  await db.delete(cartItems).where(eq(cartItems.userId, userId))

  return order[0]
}