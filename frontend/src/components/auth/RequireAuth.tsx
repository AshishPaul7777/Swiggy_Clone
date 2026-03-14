import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

type Props = {
  children: ReactNode
}

export default function RequireAuth({ children }: Props) {
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!user) {
    const redirect = `${location.pathname}${location.search}`

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    )
  }

  return <>{children}</>
}
