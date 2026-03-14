import { pgTable, uuid, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar")
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
  addressId: uuid("address_id")
    .references(() => addresses.id),
  total: integer("total"),
  currency: varchar("currency", { length: 3 }).default("INR").notNull(),
  status: varchar("status", { length: 32 }).default("created").notNull(),
  razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  foodId: uuid("food_id")
    .references(() => foodItems.id)
    .notNull(),
  foodNameSnapshot: text("food_name_snapshot").notNull(),
  foodImageSnapshot: text("food_image_snapshot"),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: integer("line_total").notNull(),
  createdAt: timestamp("created_at").defaultNow()
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
  currency: varchar("currency", { length: 3 }).default("INR").notNull(),

  paymentMethod: text("payment_method"),

  paymentStatus: text("payment_status"),
  razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
  razorpaySignature: text("razorpay_signature"),

  createdAt: timestamp("created_at").defaultNow()
})

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),

  label: varchar("label", { length: 50 }).notNull(),
  line1: text("line_1").notNull(),
  line2: text("line_2"),
  city: varchar("city", { length: 120 }).notNull(),
  state: varchar("state", { length: 120 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  landmark: text("landmark"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow()
})
