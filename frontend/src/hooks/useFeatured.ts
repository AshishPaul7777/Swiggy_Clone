import { useQuery } from "@tanstack/react-query"
import { getFeaturedFoods } from "@/api/featuredApi"

export const useFeatured = () => {
  return useQuery({
    queryKey: ["featured"],
    queryFn: getFeaturedFoods
  })
}