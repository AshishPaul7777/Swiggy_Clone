import { db } from "../db";
import { foodItems, categories, featured } from "../db/schema";
import { eq } from "drizzle-orm";

async function seedFoods() {
  try {
    const biryani = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Biryani"));

    const fastFood = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Fast Food"));

    const chinese = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Chinese"));

    const desserts = await db
      .select()
      .from(categories)
      .where(eq(categories.name, "Desserts"));

    if (
      !biryani.length ||
      !fastFood.length ||
      !chinese.length ||
      !desserts.length
    ) {
      throw new Error("Categories missing. Run seedCategories first.");
    }

    const items = [
      // Biryani
      {
        name: "Chicken Biryani",
        description: "Hyderabadi dum biryani",
        price: 299,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380414/CDB_pzdyvc.jpg",
        categoryId: biryani[0].id,
      },
      {
        name: "Mutton Biryani",
        description: "Spicy mutton biryani",
        price: 349,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380414/MDB_nm2fqn.jpg",
        categoryId: biryani[0].id,
      },
      {
        name: "Paneer Biryani",
        description: "Veg paneer dum biryani",
        price: 259,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380414/PDB_y3ilcz.jpg",
        categoryId: biryani[0].id,
      },
      {
        name: "Egg Biryani",
        description: "Flavorful egg biryani",
        price: 219,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380413/EDB_wckbir.jpg",
        categoryId: biryani[0].id,
      },

      // Fast Food
      {
        name: "Chicken Burger",
        description: "Grilled chicken burger",
        price: 179,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380413/CB_fecybk.jpg",
        categoryId: fastFood[0].id,
      },
      {
        name: "Veg Burger",
        description: "Classic veg burger",
        price: 149,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380413/VB_vkbgo6.jpg",
        categoryId: fastFood[0].id,
      },
      {
        name: "French Fries",
        description: "Crispy golden fries",
        price: 99,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/fries_b78vxo.jpg",
        categoryId: fastFood[0].id,
      },
      {
        name: "Cheese Pizza",
        description: "Loaded cheese pizza",
        price: 299,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380413/cheese_pizza_qwt9jc.jpg",
        categoryId: fastFood[0].id,
      },
      {
        name: "Pepperoni Pizza",
        description: "Classic pepperoni pizza",
        price: 349,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/pepperoni_pizza_fc5cys.jpg",
        categoryId: fastFood[0].id,
      },
      {
        name: "Hot Dog",
        description: "American style hot dog",
        price: 129,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380413/hot_dog_chxyhb.jpg",
        categoryId: fastFood[0].id,
      },

      // Chinese
      {
        name: "Veg Fried Rice",
        description: "Chinese fried rice",
        price: 199,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/vegfriedrice_d66cni.jpg",
        categoryId: chinese[0].id,
      },
      {
        name: "Chicken Fried Rice",
        description: "Chicken fried rice",
        price: 229,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/CFR_u3anbb.jpg",
        categoryId: chinese[0].id,
      },
      {
        name: "Veg Noodles",
        description: "Stir fried noodles",
        price: 189,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/VN_paxfv4.jpg",
        categoryId: chinese[0].id,
      },
      {
        name: "Chicken Noodles",
        description: "Chicken hakka noodles",
        price: 219,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/CN_jtrcwb.jpg",
        categoryId: chinese[0].id,
      },
      {
        name: "Manchurian",
        description: "Veg manchurian",
        price: 199,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/manchuria_iomkjn.jpg",
        categoryId: chinese[0].id,
      },

      // Desserts
      {
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie",
        price: 149,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/Choco_brownie_d1qjb5.jpg",
        categoryId: desserts[0].id,
      },
      {
        name: "Ice Cream Sundae",
        description: "Vanilla chocolate sundae",
        price: 129,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/sundae_bvbzlp.jpg",
        categoryId: desserts[0].id,
      },
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake",
        price: 199,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380411/Chocolate_Cake_j17us2.jpg",
        categoryId: desserts[0].id,
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake",
        price: 229,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380411/Cheesecake_byzohe.jpg",
        categoryId: desserts[0].id,
      },
      {
        name: "Donut",
        description: "Classic glazed donut",
        price: 99,
        image: "https://res.cloudinary.com/dswh4jt3a/image/upload/v1773380412/Donut_dgsq0h.jpg",
        categoryId: desserts[0].id,
      },
    ];

    await db.delete(featured);
    await db.delete(foodItems);

    const insertedFoods = await db.insert(foodItems).values(items).returning()

    // add first 5 foods as featured
    await db.insert(featured).values(
      insertedFoods.slice(0, 5).map((food) => ({
        foodId: food.id
      }))
    )
    
    console.log("Foods + featured seeded successfully")
  } catch (error) {
    console.error(error);
  }
}

seedFoods();
