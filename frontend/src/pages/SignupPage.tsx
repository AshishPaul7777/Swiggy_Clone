import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/apiError"
import { registerUser } from "@/api/authApi"
import { useAuthStore } from "@/store/authStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const redirectTo = searchParams.get("redirect") || "/profile"

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const signupMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data) => {
      setSession({
        accessToken: data.accessToken,
        user: data.user
      })

      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Account created successfully")
      navigate(redirectTo)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Signup failed"))
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    signupMutation.mutate(form)
  }

  return (
    <div className="mx-auto max-w-md rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-zinc-100">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Join
        </p>
        <h1 className="text-3xl font-black text-zinc-900">
          Create your account
        </h1>
        <p className="text-sm text-zinc-500">
          Start saving addresses and building your own delivery profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Input
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
          className="h-11 rounded-2xl"
          required
        />

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
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "Creating account..." : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-orange-500 hover:text-orange-600"
        >
          Login
        </Link>
      </p>
    </div>
  )
}
