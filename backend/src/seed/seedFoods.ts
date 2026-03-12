import { db } from "../db"
import { foodItems, categories,featured } from "../db/schema"
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

    if (!biryani.length || !fastFood.length || !chinese.length || !desserts.length) {
      throw new Error("Categories missing. Run seedCategories first.")
    }

    await db.delete(featured)
    await db.delete(foodItems)

    await db.insert(foodItems).values([
      // Biryani
      {
        name: "Chicken Biryani",
        description: "Hyderabadi dum biryani",
        price: 299,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c",
        categoryId: biryani[0].id
      },
      {
        name: "Mutton Biryani",
        description: "Spicy mutton biryani",
        price: 349,
        image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a",
        categoryId: biryani[0].id
      },
      {
        name: "Paneer Biryani",
        description: "Veg paneer dum biryani",
        price: 259,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
        categoryId: biryani[0].id
      },
      {
        name: "Egg Biryani",
        description: "Flavorful egg biryani",
        price: 219,
        image: "https://images.unsplash.com/photo-1628294895950-9805252327bc",
        categoryId: biryani[0].id
      },

      // Fast Food
      {
        name: "Chicken Burger",
        description: "Grilled chicken burger",
        price: 179,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        categoryId: fastFood[0].id
      },
      {
        name: "Veg Burger",
        description: "Classic veg burger",
        price: 149,
        image: "https://images.unsplash.com/photo-1550317138-10000687a72b",
        categoryId: fastFood[0].id
      },
      {
        name: "French Fries",
        description: "Crispy golden fries",
        price: 99,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
        categoryId: fastFood[0].id
      },
      {
        name: "Cheese Pizza",
        description: "Loaded cheese pizza",
        price: 299,
        image: "https://images.unsplash.com/photo-1548365328-9f547fb0953c",
        categoryId: fastFood[0].id
      },
      {
        name: "Pepperoni Pizza",
        description: "Classic pepperoni pizza",
        price: 349,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
        categoryId: fastFood[0].id
      },
      {
        name: "Hot Dog",
        description: "American style hot dog",
        price: 129,
        image: "https://images.unsplash.com/photo-1612392062123-5535d3e6f0ab",
        categoryId: fastFood[0].id
      },

      // Chinese
      {
        name: "Veg Fried Rice",
        description: "Chinese fried rice",
        price: 199,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
        categoryId: chinese[0].id
      },
      {
        name: "Chicken Fried Rice",
        description: "Chicken fried rice",
        price: 229,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
        categoryId: chinese[0].id
      },
      {
        name: "Veg Noodles",
        description: "Stir fried noodles",
        price: 189,
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
        categoryId: chinese[0].id
      },
      {
        name: "Chicken Noodles",
        description: "Chicken hakka noodles",
        price: 219,
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
        categoryId: chinese[0].id
      },
      {
        name: "Manchurian",
        description: "Veg manchurian",
        price: 199,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
        categoryId: chinese[0].id
      },

      // Desserts
      {
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie",
        price: 149,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
        categoryId: desserts[0].id
      },
      {
        name: "Ice Cream Sundae",
        description: "Vanilla chocolate sundae",
        price: 129,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
        categoryId: desserts[0].id
      },
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake",
        price: 199,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        categoryId: desserts[0].id
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake",
        price: 229,
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad",
        categoryId: desserts[0].id
      },
      {
        name: "Donut",
        description: "Classic glazed donut",
        price: 99,
        image: "https://images.unsplash.com/photo-1505253216365-2f06c3d3d2f1",
        categoryId: desserts[0].id
      }
    ])

    console.log("Foods seeded successfully")

  } catch (error) {
    console.error(error)
  }
}

seedFoods()