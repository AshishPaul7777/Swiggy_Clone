import { db } from "../db"
import { cartItems } from "../db/schema"
import { eq, and } from "drizzle-orm"

export async function addToCart(userId: string, foodId: string, quantity: number) {
  const result = await db
    .insert(cartItems)
    .values({
      userId,
      foodId,
      quantity
    })
    .returning()

  return result[0]
}

export async function getCart(userId: string) {
  return await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))
}

export async function updateCartItem(userId: string, foodId: string, quantity: number) {
  return await db
    .update(cartItems)
    .set({ quantity })
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.foodId, foodId)
      )
    )
}

export async function removeCartItem(userId: string, foodId: string) {
  return await db
    .delete(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.foodId, foodId)
      )
    )
}