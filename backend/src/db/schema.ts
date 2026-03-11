import { pgTable, uuid,varchar, text, integer, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
})

export const foodItems = pgTable("food_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  image: text("image"),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow()
})

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
  .references(() => users.id)
  .notNull(),

foodId: uuid("food_id")
  .references(() => foodItems.id)
  .notNull(),
  quantity: integer("quantity").notNull(),
})

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
  .references(() => users.id)
  .notNull(),
  total: integer("total"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow()
})
export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  token: text("token").notNull().unique(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow()
})
export const featured = pgTable("featured", {
  id: uuid("id").defaultRandom().primaryKey(),

  foodId: uuid("food_id")
    .references(() => foodItems.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow()
})
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),

  amount: integer("amount").notNull(),

  paymentMethod: text("payment_method"),

  paymentStatus: text("payment_status"),

  createdAt: timestamp("created_at").defaultNow()
})
