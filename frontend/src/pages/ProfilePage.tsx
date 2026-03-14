import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MapPin, MoveLeft, Plus, Trash2, UserRound } from "lucide-react"
import { toast } from "sonner"
import {
  createAddress,
  deleteAddress,
  editAddress,
  logoutUser,
  type Address,
  type AddressPayload,
  type ProfileResponse,
  type OrderHistoryItem,
  updateProfile
} from "@/api/authApi"
import { useProfile } from "@/hooks/useProfile"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import CartDrawer from "@/components/cart/CartDrawer"

const emptyAddressForm: AddressPayload = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  landmark: "",
  isDefault: false
}

type ProfileForm = {
  name: string
  email: string
  phone: string
}

const emptyProfileForm: ProfileForm = {
  name: "",
  email: "",
  phone: ""
}

function getProfileFormValue(user?: ProfileResponse["user"] | null): ProfileForm {
  if (!user) {
    return emptyProfileForm
  }

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? ""
  }
}

function formatOrderDate(value?: string | null) {
  if (!value) {
    return "Recently"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Recently"
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date)
}

function getOrderStatusClasses(status?: string | null) {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-100 text-emerald-700"
    case "created":
      return "bg-amber-100 text-amber-700"
    default:
      return "bg-zinc-100 text-zinc-600"
  }
}

function getPaymentStatusClasses(status?: string | null) {
  switch (status?.toLowerCase()) {
    case "success":
      return "bg-emerald-100 text-emerald-700"
    case "failed":
      return "bg-red-100 text-red-600"
    default:
      return "bg-zinc-100 text-zinc-600"
  }
}

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const authUser = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const items = useCartStore((state) => state.items)
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const { data, isLoading } = useProfile()

  const [profileForm, setProfileForm] = useState<ProfileForm | null>(null)
  const [addressForm, setAddressForm] = useState<AddressPayload>(emptyAddressForm)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const profileFormValue = profileForm ?? getProfileFormValue(data?.user)
  const updateProfileForm = (field: keyof ProfileForm, value: string) => {
    setProfileForm((current) => ({
      ...(current ?? getProfileFormValue(data?.user)),
      [field]: value
    }))
  }

  const saveProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (response) => {
      useAuthStore.getState().setSession({
        accessToken: useAuthStore.getState().accessToken!,
        user: {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email
        }
      })

      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Profile updated")
    },
    onError: () => {
      toast.error("Unable to update profile")
    }
  })

  const saveAddressMutation = useMutation({
    mutationFn: async (payload: AddressPayload) => {
      if (editingAddressId) {
        return editAddress(editingAddressId, payload)
      }

      return createAddress(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      setEditingAddressId(null)
      setAddressForm(emptyAddressForm)
      toast.success("Address saved")
    },
    onError: () => {
      toast.error("Unable to save address")
    }
  })

  const deleteAddressMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Address removed")
    },
    onError: () => {
      toast.error("Unable to remove address")
    }
  })

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveProfileMutation.mutate(profileFormValue)
  }

  const handleAddressSubmit = (e: FormEvent) => {
    e.preventDefault()
    saveAddressMutation.mutate(addressForm)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id)
    setAddressForm({
      label: address.label,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      landmark: address.landmark ?? "",
      isDefault: address.isDefault
    })
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch {
      // Clearing local session is still safe even if the server cookie is already gone.
    }

    clearSession()
    await queryClient.invalidateQueries({ queryKey: ["profile"] })
    toast.success("Logged out")
  }

  const defaultAddress = useMemo(
    () => data?.addresses?.find((address) => address.isDefault) ?? null,
    [data]
  )
  const recentOrders = data?.orders ?? []

  if (!authUser) {
    return (
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-zinc-100">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Profile
        </p>
        <h1 className="mt-3 text-3xl font-black text-zinc-900">
          Login to unlock your delivery profile
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Save addresses, edit your details, and keep your orders organized in one place.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="h-11 rounded-full bg-orange-500 px-5 text-white hover:bg-orange-600">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-5">
            <Link to="/signup">Sign up</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-white/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="min-w-fit">
              <div className="leading-none">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.45em] text-orange-500">
                  Hell
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
                  Kitchen
                </p>
              </div>
            </Link>

            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-zinc-200 bg-white/90 px-4 text-zinc-800 hover:bg-white"
            >
              <Link to="/">
                <MoveLeft className="size-4" />
                Back to home
              </Link>
            </Button>
          </div>

          <CartDrawer />
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 text-white shadow-xl">
        <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_1fr] md:px-8">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
              <UserRound className="size-4" />
              Logged in as {authUser.name}
            </p>

            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Your profile hub
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/90 md:text-base">
                Manage account details, delivery addresses, and your current cart snapshot.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-full bg-white px-5 text-orange-600 hover:bg-white/90">
                <Link to="/">Browse menu</Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full border-white/50 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            <div className="rounded-3xl bg-black/15 p-5 backdrop-blur">
              <p className="text-sm text-white/80">Cart Value</p>
              <p className="mt-2 text-2xl font-bold">Rs. {cartTotal}</p>
            </div>
            <div className="rounded-3xl bg-black/15 p-5 backdrop-blur">
              <p className="text-sm text-white/80">Saved Addresses</p>
              <p className="mt-2 text-2xl font-bold">{data?.addresses?.length ?? 0}</p>
            </div>
            <div className="rounded-3xl bg-black/15 p-5 backdrop-blur">
              <p className="text-sm text-white/80">Orders Placed</p>
              <p className="mt-2 text-2xl font-bold">{recentOrders.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <article className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <h2 className="text-2xl font-bold text-zinc-900">
            Personal details
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Keep your account information current for smoother checkout and support.
          </p>

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
            <Input
              className="h-11 rounded-2xl"
              placeholder="Full name"
              value={profileFormValue.name}
              onChange={(e) => updateProfileForm("name", e.target.value)}
            />
            <Input
              className="h-11 rounded-2xl"
              type="email"
              placeholder="Email"
              value={profileFormValue.email}
              onChange={(e) => updateProfileForm("email", e.target.value)}
            />
            <Input
              className="h-11 rounded-2xl"
              placeholder="Phone"
              value={profileFormValue.phone}
              onChange={(e) => updateProfileForm("phone", e.target.value)}
            />

            <Button
              type="submit"
              className="h-11 rounded-2xl bg-orange-500 px-5 text-white hover:bg-orange-600"
              disabled={saveProfileMutation.isPending}
            >
              {saveProfileMutation.isPending ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </article>

        <article className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">
                Delivery addresses
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Add home, work, and favorite drop spots like a real delivery app.
              </p>
            </div>
            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
              {data?.addresses?.length ?? 0} saved
            </span>
          </div>

          <form onSubmit={handleAddressSubmit} className="mt-6 grid gap-3 md:grid-cols-2">
            <Input
              className="h-11 rounded-2xl"
              placeholder="Label"
              value={addressForm.label}
              onChange={(e) => setAddressForm((current) => ({ ...current, label: e.target.value }))}
              required
            />
            <Input
              className="h-11 rounded-2xl"
              placeholder="Address line 1"
              value={addressForm.line1}
              onChange={(e) => setAddressForm((current) => ({ ...current, line1: e.target.value }))}
              required
            />
            <Input
              className="h-11 rounded-2xl md:col-span-2"
              placeholder="Address line 2"
              value={addressForm.line2}
              onChange={(e) => setAddressForm((current) => ({ ...current, line2: e.target.value }))}
            />
            <Input
              className="h-11 rounded-2xl"
              placeholder="City"
              value={addressForm.city}
              onChange={(e) => setAddressForm((current) => ({ ...current, city: e.target.value }))}
              required
            />
            <Input
              className="h-11 rounded-2xl"
              placeholder="State"
              value={addressForm.state}
              onChange={(e) => setAddressForm((current) => ({ ...current, state: e.target.value }))}
              required
            />
            <Input
              className="h-11 rounded-2xl"
              placeholder="Postal code"
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm((current) => ({ ...current, postalCode: e.target.value }))}
              required
            />
            <Input
              className="h-11 rounded-2xl"
              placeholder="Landmark"
              value={addressForm.landmark}
              onChange={(e) => setAddressForm((current) => ({ ...current, landmark: e.target.value }))}
            />

            <label className="md:col-span-2 flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={Boolean(addressForm.isDefault)}
                onChange={(e) =>
                  setAddressForm((current) => ({ ...current, isDefault: e.target.checked }))
                }
              />
              Make this my default address
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button
                type="submit"
                className="h-11 rounded-2xl bg-orange-500 px-5 text-white hover:bg-orange-600"
                disabled={saveAddressMutation.isPending}
              >
                <Plus className="size-4" />
                {saveAddressMutation.isPending
                  ? "Saving..."
                  : editingAddressId
                    ? "Update address"
                    : "Add address"}
              </Button>

              {editingAddressId ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-2xl px-5"
                  onClick={() => {
                    setEditingAddressId(null)
                    setAddressForm(emptyAddressForm)
                  }}
                >
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>

          <div className="mt-8 space-y-3">
            {isLoading ? (
              <p className="text-sm text-zinc-500">Loading addresses...</p>
            ) : null}

            {data?.addresses?.length ? (
              data.addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-3xl border border-zinc-100 bg-zinc-50 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <span className="rounded-2xl bg-white p-3 text-orange-500 shadow-sm">
                        <MapPin className="size-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-zinc-900">
                            {address.label}
                          </p>
                          {address.isDefault ? (
                            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                              Default
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-zinc-600">
                          {[address.line1, address.line2, address.city, address.state, address.postalCode]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {address.landmark ? (
                          <p className="mt-1 text-xs text-zinc-500">
                            Landmark: {address.landmark}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full px-4"
                        onClick={() => handleEditAddress(address)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className="rounded-full px-4"
                        onClick={() => deleteAddressMutation.mutate(address.id)}
                        disabled={deleteAddressMutation.isPending}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : !isLoading ? (
              <div className="rounded-3xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
                No addresses yet. Add your first delivery location above.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Order history
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Track your paid orders, delivery destination, and payment status.
            </p>
          </div>

          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
            {recentOrders.length} orders
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {recentOrders.length ? (
            recentOrders.map((order: OrderHistoryItem) => (
              <article
                key={order.id}
                className="rounded-[24px] border border-zinc-100 bg-zinc-50 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-bold text-zinc-950">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}
                      >
                        {order.status}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClasses(order.paymentStatus)}`}
                      >
                        {order.paymentStatus ?? "pending"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-500">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-black text-zinc-950">
                      Rs. {order.total ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Delivered To
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                      {order.addressLabel ?? defaultAddress?.label ?? "Address unavailable"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Payment Method
                    </p>
                    <p className="mt-2 text-sm font-semibold uppercase text-zinc-900">
                      {order.paymentMethod ?? "Razorpay"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Payment Reference
                    </p>
                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                      {order.razorpayPaymentId ?? "Awaiting payment"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Items Ordered
                  </p>

                  <div className="mt-4 space-y-3">
                    {order.items.length ? (
                      order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 p-3"
                        >
                          <div className="flex items-center gap-3">
                            {item.foodImageSnapshot ? (
                              <img
                                src={item.foodImageSnapshot}
                                alt={item.foodNameSnapshot}
                                className="size-14 rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                                Dish
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-zinc-900">
                                {item.foodNameSnapshot}
                              </p>
                              <p className="mt-1 text-sm text-zinc-500">
                                Rs. {item.unitPrice} each
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-zinc-900">
                              x {item.quantity}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                              Rs. {item.lineTotal}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">
                        Item details unavailable for this order.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-500">
              No orders yet. Once you complete checkout, your history will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
