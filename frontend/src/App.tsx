import AppRoutes from "./routes"
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getCategories } from "@/api/categoryApi"
import { refreshSession } from "@/api/authApi"
import { useAuthStore } from "@/store/authStore"

function runWhenBrowserIsIdle(task: () => void, fallbackDelay = 250) {
  if (typeof window === "undefined") {
    task()
    return () => undefined
  }

  const windowWithIdleCallbacks = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback) => number
    cancelIdleCallback?: (handle: number) => void
  }

  if (typeof windowWithIdleCallbacks.requestIdleCallback === "function") {
    const idleId = windowWithIdleCallbacks.requestIdleCallback(() => task())

    return () => windowWithIdleCallbacks.cancelIdleCallback?.(idleId)
  }

  const timeoutId = window.setTimeout(task, fallbackDelay)

  return () => window.clearTimeout(timeoutId)
}

function App() {
  const [search, setSearch] = useState("")
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)
  const hasTriedRefresh = useRef(false)

  useEffect(() => {
    return runWhenBrowserIsIdle(() => {
      queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: getCategories
      })
    }, 800)
  }, [queryClient])

  useEffect(() => {
    if (!hasHydrated || hasTriedRefresh.current) {
      return
    }

    hasTriedRefresh.current = true

    if (!user) {
      return
    }

    return runWhenBrowserIsIdle(() => {
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
    }, 1200)
  }, [clearSession, hasHydrated, setSession, user])

  return (
    <>
      <AppRoutes search={search} setSearch={setSearch} />
      <Toaster />
    </>
  )
}

export default App
