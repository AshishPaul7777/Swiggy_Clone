import { useQuery } from "@tanstack/react-query"
import { getProfile } from "@/api/authApi"
import { useAuthStore } from "@/store/authStore"

export const useProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    enabled: !!accessToken
  })
}
