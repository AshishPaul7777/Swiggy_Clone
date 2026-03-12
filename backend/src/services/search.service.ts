import { db } from "../db"
import { foodItems } from "../db/schema"
import { ilike } from "drizzle-orm"

export async function searchFoods(query: string) {

  const foods = await db
    .select()
    .from(foodItems)
    .where(
      ilike(foodItems.name, `%${query}%`)
    )

  return foods
}