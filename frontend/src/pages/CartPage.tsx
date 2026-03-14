import { useCartStore } from "@/store/cartStore"
import CartItem from "@/components/cart/CartItem"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"

export default function CartPage() {

  const items = useCartStore((state) => state.items)
  const user = useAuthStore((state) => state.user)

  const navigate = useNavigate()

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        Your cart is empty
      </div>
    )
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to place an order")
      navigate("/login?redirect=%2Fcheckout")
      return
    }

    navigate("/checkout")
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">

      <h1 className="text-2xl font-bold mb-4">
        Your Cart
      </h1>

      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}

      <div className="border-t pt-4 flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
      >
        Proceed to Checkout
      </button>

    </div>
  )
}
