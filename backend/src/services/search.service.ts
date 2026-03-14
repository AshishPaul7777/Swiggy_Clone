import { db } from "../db"
import { categories, foodItems } from "../db/schema"
import { asc, ilike, or, sql } from "drizzle-orm"

export async function searchFoods(query: string) {
  const trimmedQuery = query.trim()

  const foods = await db
    .select({
      id: foodItems.id,
      name: foodItems.name,
      description: foodItems.description,
      price: foodItems.price,
      image: foodItems.image,
      categoryId: foodItems.categoryId
    })
    .from(foodItems)
    .leftJoin(categories, sql`${foodItems.categoryId} = ${categories.id}`)
    .where(
      or(
        ilike(foodItems.name, `%${trimmedQuery}%`),
        ilike(foodItems.description, `%${trimmedQuery}%`),
        ilike(categories.name, `%${trimmedQuery}%`)
      )
    )
    .orderBy(
      sql`
        case
          when lower(${foodItems.name}) = lower(${trimmedQuery}) then 0
          when lower(${foodItems.name}) like lower(${`${trimmedQuery}%`}) then 1
          when lower(${categories.name}) = lower(${trimmedQuery}) then 2
          when lower(${categories.name}) like lower(${`${trimmedQuery}%`}) then 3
          when lower(${foodItems.name}) like lower(${`%${trimmedQuery}%`}) then 4
          when lower(${foodItems.description}) like lower(${`%${trimmedQuery}%`}) then 5
          else 6
        end
      `,
      asc(foodItems.name)
    )

  return foods
}
