import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/apiError"
import { loginUser } from "@/api/authApi"
import { useAuthStore } from "@/store/authStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const redirectTo = searchParams.get("redirect") || "/profile"

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      setSession({
        accessToken: data.accessToken,
        user: data.user
      })

      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Logged in successfully")
      navigate(redirectTo)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Login failed"))
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(form)
  }

  return (
    <div className="mx-auto max-w-md rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Account
        </p>
        <h1 className="text-3xl font-black text-zinc-900">
          Login to Hell Kitchen
        </h1>
        <p className="text-sm text-zinc-500">
          Save addresses, manage your profile, and keep your cart in sync.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
          className="h-11 rounded-2xl"
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
          className="h-11 rounded-2xl"
          required
        />

        <Button
          type="submit"
          className="h-11 w-full rounded-2xl bg-orange-500 text-white hover:bg-orange-600"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-zinc-500">
        New here?{" "}
        <Link
          to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
