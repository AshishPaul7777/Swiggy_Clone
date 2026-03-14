import { useQuery } from "@tanstack/react-query"
import { getFoods } from "@/api/foodApi"

export const useFoods = (categoryId?: string) => {
  return useQuery({
    queryKey: ["foods", categoryId ?? "all"],
    queryFn: () => getFoods(categoryId),
    staleTime: 1000 * 60 * 5
  })
}
