import { db } from "../db"
import { categories } from "../db/schema"

async function seedCategories() {
  await db.insert(categories).values([
    { name: "Biryani", description: "Biryani dishes" },
    { name: "Fast Food", description: "Burgers and fries" },
    { name: "Chinese", description: "Noodles and fried rice" },
    { name: "Desserts", description: "Sweet dishes" }
  ])

  console.log("Categories seeded successfully")
}

seedCategories()