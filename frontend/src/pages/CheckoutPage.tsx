import { useCartStore } from "@/store/cartStore"
import { useNavigate } from "react-router-dom"

export default function CheckoutPage() {

  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  const navigate = useNavigate()

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handlePlaceOrder = () => {
    clearCart()
    navigate("/order-success")
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Checkout
      </h1>

      <div className="space-y-3">

        {items.map((item) => (
          <div key={item.id} className="flex justify-between">

            <span>
              {item.name} x {item.quantity}
            </span>

            <span>
              ₹{item.price * item.quantity}
            </span>

          </div>
        ))}

      </div>

      <div className="border-t pt-4 flex justify-between font-bold text-lg">

        <span>Total</span>

        <span>₹{total}</span>

      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
      >
        Place Order
      </button>

    </div>
  )
}