import { db } from "../db"
import { foodItems } from "../db/schema"
import { eq } from "drizzle-orm"

export async function getAllFoods(categoryId?: string) {

  if (categoryId) {
    return await db
      .select()
      .from(foodItems)
      .where(eq(foodItems.categoryId, categoryId))
  }

  return await db.select().from(foodItems)
}

export async function getFoodById(id: string) {
  const result = await db
    .select()
    .from(foodItems)
    .where(eq(foodItems.id, id))

  return result[0]
}

export async function createFood(data: any) {
  const result = await db
    .insert(foodItems)
    .values(data)
    .returning()

  return result[0]
}