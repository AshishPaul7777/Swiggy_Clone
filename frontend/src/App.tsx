import AppRoutes from "./routes"
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getCategories } from "@/api/categoryApi"
import { refreshSession } from "@/api/authApi"
import { useAuthStore } from "@/store/authStore"

function App() {
  const [search, setSearch] = useState("")
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const hasTriedRefresh = useRef(false)

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories
    })
  }, [queryClient])

  useEffect(() => {
    if (!hasHydrated || hasTriedRefresh.current) {
      return
    }

    hasTriedRefresh.current = true

    if (!user) {
      return
    }

    refreshSession()
      .then((data) => {
        setSession({
          accessToken: data.accessToken,
          user: data.user
        })
      })
      .catch(() => {
        clearSession()
      })
  }, [clearSession, hasHydrated, setSession, user])

  return (
    <>
      <AppRoutes search={search} setSearch={setSearch} />
      <Toaster />
    </>
  )
}

export default App
