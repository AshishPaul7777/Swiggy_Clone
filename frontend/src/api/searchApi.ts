import { api } from "./axios"

export const searchFoods = async (query: string) => {
  const res = await api.get("/search", {
    params: { q: query }
  })

  return res.data
}