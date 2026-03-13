import { api } from "./axios"

export const getFeaturedFoods = async () => {
  const res = await api.get("/featured")
  return res.data
}