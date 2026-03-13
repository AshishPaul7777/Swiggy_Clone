import { useQuery } from "@tanstack/react-query"
import { searchFoods } from "@/api/searchApi"

export const useSearchFoods = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchFoods(query),
    enabled: !!query
  })
}