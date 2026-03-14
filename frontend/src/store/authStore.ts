import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
  id: string
  name: string
  email: string
}

type AuthState = {
  accessToken: string | null
  user: AuthUser | null
  hasHydrated: boolean
  setSession: (payload: { accessToken: string; user: AuthUser }) => void
  clearSession: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setSession: ({ accessToken, user }) =>
        set({
          accessToken,
          user
        }),
      clearSession: () =>
        set({
          accessToken: null,
          user: null
        }),
      setHasHydrated: (value) =>
        set({
          hasHydrated: value
        })
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)
