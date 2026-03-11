import { db } from "../db"
import { categories, foodItems } from "../db/schema"
import { eq } from "drizzle-orm"

export async function getCategories() {
  return await db.select().from(categories)
}

export async function getFoodsByCategory(categoryId: string) {
  return await db
    .select()
    .from(foodItems)
    .where(eq(foodItems.categoryId, categoryId))
}