import { useQuery } from "@tanstack/react-query"
import { getCategories } from "@/api/categoryApi"

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,

    // Cache settings
    staleTime: 1000 * 60 * 60,      // 1 hour: considered fresh
    gcTime: 1000 * 60 * 60 * 24,    // 24 hours: keep in cache
    refetchOnWindowFocus: false,    // avoid refetch when switching tabs
  })
}