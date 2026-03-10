import { db } from "../db"
import { foodItems, categories } from "../db/schema"
import { eq } from "drizzle-orm"

async function seedFoods() {
  try {

    const biryani = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Biryani"))

    const fastFood = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Fast Food"))

    const chinese = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Chinese"))

    const desserts = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Desserts"))
    
    async function seedFoods() {
        await db.delete(foodItems)  
    await db.insert(foodItems).values([
      {
        name: "Chicken Biryani",
        description: "Hyderabadi dum biryani",
        price: 299,
        image: "biryani.jpg",
        categoryId: biryani[0].id
      },
      {
        name: "Mutton Biryani",
        description: "Spicy mutton biryani",
        price: 349,
        image: "mutton-biryani.jpg",
        categoryId: biryani[0].id
      },
      {
        name: "Chicken Burger",
        description: "Grilled chicken burger",
        price: 179,
        image: "burger.jpg",
        categoryId: fastFood[0].id
      },
      {
        name: "French Fries",
        description: "Crispy golden fries",
        price: 99,
        image: "fries.jpg",
        categoryId: fastFood[0].id
      },
      {
        name: "Veg Fried Rice",
        description: "Chinese fried rice",
        price: 199,
        image: "friedrice.jpg",
        categoryId: chinese[0].id
      },
      {
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie",
        price: 149,
        image: "brownie.jpg",
        categoryId: desserts[0].id
      }
    ])
    }
    console.log("Foods seeded successfully")

  } catch (error) {
    console.error(error)
  }
}

seedFoods()