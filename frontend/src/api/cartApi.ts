import { api } from "./axios"

export const addToCart = async (foodId: string, quantity: number) => {
  const res = await api.post("/cart", {
    foodId,
    quantity
  })

  return res.data
}

export const getCart = async () => {
  const res = await api.get("/cart")
  return res.data
}