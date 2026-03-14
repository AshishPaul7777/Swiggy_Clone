import type { Category } from "@/types/category"
import { api } from "./axios"

export const getCategories = async () => {
  const res = await api.get<Category[]>("/categories")
  return res.data
}
