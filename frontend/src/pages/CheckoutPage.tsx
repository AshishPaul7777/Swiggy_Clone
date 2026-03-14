import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MapPin, MoveLeft, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { createCheckoutOrder, verifyPayment } from "@/api/paymentApi"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/apiError"

let razorpayScriptPromise: Promise<boolean> | null = null

function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(false)
  }

  if (window.Razorpay) {
    return Promise.resolve(true)
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise
  }

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  return razorpayScriptPromise
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const user = useAuthStore((state) => state.user)
  const { data, isLoading } = useProfile()
  const navigate = useNavigate()
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)

  const addresses = useMemo(() => data?.addresses ?? [], [data?.addresses])

  useEffect(() => {
    if (!addresses.length) {
      setSelectedAddressId(null)
      return
    }

    setSelectedAddressId((current) => {
      if (current && addresses.some((address) => address.id === current)) {
        return current
      }

      return addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? null
    })
  }, [addresses])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ?? null

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order")
      navigate("/login?redirect=%2Fcheckout")
      return
    }

    if (!selectedAddress) {
      toast.error("Please choose a delivery address")
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    try {
      setIsPaying(true)

      const isScriptLoaded = await loadRazorpayScript()

      if (!isScriptLoaded || !window.Razorpay) {
        toast.error("Unable to load Razorpay checkout")
        return
      }

      const checkout = await createCheckoutOrder({
        addressId: selectedAddress.id,
        items: items.map((item) => ({
          foodId: item.id,
          quantity: item.quantity
        }))
      })

      const razorpay = new window.Razorpay({
        key: checkout.razorpay.keyId,
        amount: checkout.razorpay.amount,
        currency: checkout.razorpay.currency,
        name: "Hell Kitchen",
        description: `Order #${checkout.order.id.slice(0, 8)}`,
        order_id: checkout.razorpay.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: data?.user.phone ?? ""
        },
        notes: {
          addressLabel: checkout.address.label,
          appOrderId: checkout.order.id
        },
        theme: {
          color: "#f97316"
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false)
            toast.error("Payment cancelled")
          }
        },
        handler: async (response) => {
          try {
            await verifyPayment({
              appOrderId: checkout.order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })

            clearCart()
            toast.success("Payment successful and order placed")
            navigate("/order-success")
          } catch (error) {
            toast.error(getApiErrorMessage(error, "Payment verification failed"))
          } finally {
            setIsPaying(false)
          }
        }
      })

      razorpay.open()
    } catch (error) {
      setIsPaying(false)
      toast.error(getApiErrorMessage(error, "Unable to start payment"))
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 text-center shadow-sm ring-1 ring-zinc-100">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
          Checkout
        </p>
        <h1 className="mt-3 text-3xl font-black text-zinc-900">
          Your cart is empty
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Add a few dishes first, then come back to choose your delivery address.
        </p>

        <Button asChild className="mt-8 h-11 rounded-full bg-zinc-950 px-5 text-white hover:bg-orange-600">
          <Link to="/">Browse menu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="rounded-[32px] border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Checkout
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
              Choose where we should deliver your order
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 md:text-base">
              Pick a saved address first, then complete payment in Razorpay test mode.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-zinc-200 bg-white px-4 text-zinc-800 hover:bg-zinc-50"
          >
            <Link to="/cart">
              <MoveLeft className="size-4" />
              Back to cart
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-zinc-100 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                Delivery Address
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950">
                Select a saved address
              </h2>
            </div>

            <Button asChild variant="outline" className="rounded-full px-4">
              <Link to="/profile">Manage addresses</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-[28px] bg-zinc-100" />
              ))}
            </div>
          ) : null}

          {!isLoading && addresses.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-zinc-200 bg-zinc-50 p-6">
              <p className="text-lg font-bold text-zinc-900">
                No saved addresses yet
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Add an address in your profile before placing this order.
              </p>

              <Button asChild className="mt-5 h-11 rounded-full bg-orange-500 px-5 text-white hover:bg-orange-600">
                <Link to="/profile">Add address</Link>
              </Button>
            </div>
          ) : null}

          {!isLoading && addresses.length > 0 ? (
            <div className="mt-6 space-y-4">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address.id

                return (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`w-full rounded-[28px] border p-5 text-left transition ${
                      isSelected
                        ? "border-orange-400 bg-orange-50/80 shadow-lg shadow-orange-100"
                        : "border-zinc-200 bg-white hover:border-orange-200 hover:bg-orange-50/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <span
                          className={`rounded-2xl p-3 ${
                            isSelected
                              ? "bg-orange-500 text-white"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          <MapPin className="size-5" />
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-bold text-zinc-950">
                              {address.label}
                            </p>
                            {address.isDefault ? (
                              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-orange-600 ring-1 ring-orange-200">
                                Default
                              </span>
                            ) : null}
                            {isSelected ? (
                              <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-white">
                                Selected
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-2 text-sm leading-6 text-zinc-600">
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

                      <div
                        className={`mt-1 size-5 rounded-full border-2 ${
                          isSelected
                            ? "border-orange-500 bg-orange-500"
                            : "border-zinc-300 bg-white"
                        }`}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <section className="rounded-[32px] bg-zinc-950 p-6 text-white shadow-xl md:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-300">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Delivery Summary
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Ready to pay
                </h2>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                Deliver To
              </p>

              {selectedAddress ? (
                <div className="mt-3 space-y-2">
                  <p className="text-lg font-bold text-white">
                    {selectedAddress.label}
                  </p>
                  <p className="text-sm leading-6 text-zinc-300">
                    {[
                      selectedAddress.line1,
                      selectedAddress.line2,
                      selectedAddress.city,
                      selectedAddress.state,
                      selectedAddress.postalCode
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-zinc-400">
                  Select an address to continue.
                </p>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-300">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold text-white">
                    Rs. {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                Total
              </span>
              <span className="text-3xl font-black text-white">
                Rs. {total}
              </span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || isPaying}
              className="mt-6 h-12 w-full rounded-full bg-orange-500 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-700"
            >
              {isPaying ? "Starting Payment..." : "Pay with Razorpay"}
            </Button>
          </section>
        </aside>
      </div>
    </div>
  )
}
