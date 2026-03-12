import { db } from "../db"
import { featured, foodItems } from "../db/schema"
import { eq } from "drizzle-orm"

export async function getFeaturedFoods() {
  return await db
    .select({
      id: foodItems.id,
      name: foodItems.name,
      description: foodItems.description,
      price: foodItems.price,
      image: foodItems.image
    })
    .from(featured)
    .innerJoin(foodItems, eq(featured.foodId, foodItems.id))
}