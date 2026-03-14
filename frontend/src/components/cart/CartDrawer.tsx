import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/authStore"
import { useCartStore } from "@/store/cartStore"
import CartItem from "./CartItem"

export default function CartDrawer() {
  const navigate = useNavigate()

  const items = useCartStore((state) => state.items)
  const user = useAuthStore((state) => state.user)

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to place an order")
      navigate("/login?redirect=%2Fcheckout")
      return
    }

    navigate("/checkout")
  }

  return (
    <Sheet>
      <SheetTrigger className="relative">
        <div className="inline-flex size-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
          <ShoppingCart size={22} />
        </div>

        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
            {itemCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent className="border-zinc-200 bg-[#f8f2ea] text-zinc-950 shadow-2xl">
        <SheetHeader className="border-b border-zinc-200/80 px-6 py-5">
          <SheetTitle className="text-3xl font-black tracking-tight text-zinc-950">
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="mt-2 flex-1 space-y-4 overflow-y-auto px-6 pb-6">
          {items.length === 0 && (
            <div className="flex flex-col items-center rounded-[28px] border border-dashed border-zinc-300 bg-white/80 py-20 text-zinc-500">
              <ShoppingCart size={40} />

              <p className="mt-3 text-base font-medium">
                Your cart is empty
              </p>
            </div>
          )}

          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          {items.length > 0 && (
            <div className="sticky bottom-0 space-y-4 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Total
                </p>

                <p className="text-2xl font-black text-zinc-950">
                  Rs. {total}
                </p>
              </div>

              <Button
                className="h-12 w-full rounded-full bg-zinc-950 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-600"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
