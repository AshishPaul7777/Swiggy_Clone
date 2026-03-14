import type { Food } from "@/types/food"
import { api } from "./axios"

export const getFeaturedFoods = async () => {
  const res = await api.get<Food[]>("/featured")
  return res.data
}
