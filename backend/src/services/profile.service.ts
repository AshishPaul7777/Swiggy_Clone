import { and, desc, eq, ne } from "drizzle-orm"
import { db } from "../db"
import { addresses, orderItems, orders, payments, users } from "../db/schema"

export async function getProfileByUserId(userId: string) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      avatar: users.avatar
    })
    .from(users)
    .where(eq(users.id, userId))

  return result[0]
}

export async function updateProfileByUserId(
  userId: string,
  data: {
    name: string
    email: string
    phone?: string
  }
) {
  const result = await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      phone: data.phone || null
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      avatar: users.avatar
    })

  return result[0]
}

export async function getAddressesByUserId(userId: string) {
  return db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt))
}

export async function getOrdersByUserId(userId: string) {
  const rows = await db
    .select({
      id: orders.id,
      total: orders.total,
      currency: orders.currency,
      status: orders.status,
      createdAt: orders.createdAt,
      addressId: orders.addressId,
      addressLabel: addresses.label,
      paymentStatus: payments.paymentStatus,
      paymentMethod: payments.paymentMethod,
      razorpayPaymentId: payments.razorpayPaymentId,
      itemId: orderItems.id,
      foodId: orderItems.foodId,
      foodNameSnapshot: orderItems.foodNameSnapshot,
      foodImageSnapshot: orderItems.foodImageSnapshot,
      unitPrice: orderItems.unitPrice,
      quantity: orderItems.quantity,
      lineTotal: orderItems.lineTotal
    })
    .from(orders)
    .leftJoin(addresses, eq(orders.addressId, addresses.id))
    .leftJoin(payments, eq(payments.orderId, orders.id))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))

  const orderMap = new Map<string, {
    id: string
    total: number | null
    currency: string
    status: string
    createdAt: Date | null
    addressId: string | null
    addressLabel: string | null
    paymentStatus: string | null
    paymentMethod: string | null
    razorpayPaymentId: string | null
    items: Array<{
      id: string
      foodId: string
      foodNameSnapshot: string
      foodImageSnapshot: string | null
      unitPrice: number
      quantity: number
      lineTotal: number
    }>
  }>()

  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id,
        total: row.total ?? null,
        currency: row.currency,
        status: row.status,
        createdAt: row.createdAt ?? null,
        addressId: row.addressId ?? null,
        addressLabel: row.addressLabel ?? null,
        paymentStatus: row.paymentStatus ?? null,
        paymentMethod: row.paymentMethod ?? null,
        razorpayPaymentId: row.razorpayPaymentId ?? null,
        items: []
      })
    }

    if (row.itemId) {
      orderMap.get(row.id)?.items.push({
        id: row.itemId,
        foodId: row.foodId!,
        foodNameSnapshot: row.foodNameSnapshot!,
        foodImageSnapshot: row.foodImageSnapshot ?? null,
        unitPrice: row.unitPrice!,
        quantity: row.quantity!,
        lineTotal: row.lineTotal!
      })
    }
  }

  return Array.from(orderMap.values())
}

export async function createAddress(
  userId: string,
  data: {
    label: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    landmark?: string
    isDefault?: boolean
  }
) {
  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId))
  }

  const result = await db
    .insert(addresses)
    .values({
      userId,
      label: data.label,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      landmark: data.landmark || null,
      isDefault: Boolean(data.isDefault)
    })
    .returning()

  return result[0]
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: {
    label: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    landmark?: string
    isDefault?: boolean
  }
) {
  if (data.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false })
      .where(and(eq(addresses.userId, userId), ne(addresses.id, addressId)))
  }

  const result = await db
    .update(addresses)
    .set({
      label: data.label,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      landmark: data.landmark || null,
      isDefault: Boolean(data.isDefault)
    })
    .where(and(eq(addresses.userId, userId), eq(addresses.id, addressId)))
    .returning()

  return result[0]
}

export async function deleteAddress(userId: string, addressId: string) {
  const result = await db
    .delete(addresses)
    .where(and(eq(addresses.userId, userId), eq(addresses.id, addressId)))
    .returning()

  return result[0]
}
