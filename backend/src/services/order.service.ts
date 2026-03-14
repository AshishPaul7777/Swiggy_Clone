import { and, eq, inArray } from "drizzle-orm"
import { razorpay, razorpayKeyId, verifyRazorpaySignature } from "../config/razorpay"
import { db } from "../db"
import { addresses, foodItems, orderItems, orders, payments } from "../db/schema"

type CheckoutItemInput = {
  foodId: string
  quantity: number
}

export async function createCheckoutOrder(
  userId: string,
  addressId: string,
  items: CheckoutItemInput[]
) {
  const [address] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))

  if (!address) {
    throw new Error("Address not found")
  }

  const foodIds = [...new Set(items.map((item) => item.foodId))]

  const foods = await db
    .select()
    .from(foodItems)
    .where(inArray(foodItems.id, foodIds))

  if (foods.length !== foodIds.length) {
    throw new Error("Some food items are unavailable")
  }

  const foodMap = new Map(foods.map((food) => [food.id, food]))

  const lineItems = items.map((item) => {
    const food = foodMap.get(item.foodId)

    if (!food) {
      throw new Error("Food item not found")
    }

    return {
      foodId: food.id,
      name: food.name,
      image: food.image,
      quantity: item.quantity,
      unitPrice: food.price,
      lineTotal: food.price * item.quantity
    }
  })

  const total = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)

  const [appOrder] = await db
    .insert(orders)
    .values({
      userId,
      addressId,
      total,
      currency: "INR",
      status: "created"
    })
    .returning()

  await db.insert(orderItems).values(
    lineItems.map((item) => ({
      orderId: appOrder.id,
      foodId: item.foodId,
      foodNameSnapshot: item.name,
      foodImageSnapshot: item.image ?? null,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    }))
  )

  const razorpayOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: `swiggy_clone_${appOrder.id.slice(0, 18)}`,
    notes: {
      appOrderId: appOrder.id,
      addressLabel: address.label
    }
  })

  const [updatedOrder] = await db
    .update(orders)
    .set({
      razorpayOrderId: razorpayOrder.id
    })
    .where(eq(orders.id, appOrder.id))
    .returning()

  return {
    order: updatedOrder,
    razorpay: {
      keyId: razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id
    },
    address,
    lineItems
  }
}

export async function verifyCheckoutPayment(
  userId: string,
  {
    appOrderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  }: {
    appOrderId: string
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }
) {
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, appOrderId), eq(orders.userId, userId)))

  if (!order) {
    throw new Error("Order not found")
  }

  if (order.status === "paid") {
    return order
  }

  if (!order.razorpayOrderId || order.razorpayOrderId !== razorpayOrderId) {
    throw new Error("Razorpay order mismatch")
  }

  const isValid = verifyRazorpaySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature
  })

  if (!isValid) {
    throw new Error("Invalid payment signature")
  }

  await db.insert(payments).values({
    orderId: order.id,
    amount: order.total ?? 0,
    currency: order.currency,
    paymentMethod: "RAZORPAY",
    paymentStatus: "SUCCESS",
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  })

  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: "paid"
    })
    .where(eq(orders.id, order.id))
    .returning()

  return updatedOrder
}
