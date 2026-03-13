import { api } from "./axios"

export const getFoods = async (categoryId?: string) => {

  const res = await api.get("/foods", {
    params: { categoryId }
  })

  return res.data
}
export const getFoodById = async (id: string) => {
    const res = await api.get(`/foods/${id}`)
    return res.data
  }