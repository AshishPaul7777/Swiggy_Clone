import { useQuery } from "@tanstack/react-query"
import { getFoodById } from "@/api/foodApi"

export const useFood = (id?: string) => {
  return useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  })
}
