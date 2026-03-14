import { api } from "./axios"
import type { Food } from "@/types/food"

export const getFoods = async (categoryId?: string): Promise<Food[]> => {
  const res = await api.get("/foods", {
    params: categoryId ? { categoryId } : {}
  })

  return res.data
}

export const getFoodById = async (id: string): Promise<Food> => {
  const res = await api.get(`/foods/${id}`)
  return res.data
}
