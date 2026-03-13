import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from "@/components/ui/sheet"
  
  import { ShoppingCart } from "lucide-react"
  import { useCartStore } from "@/store/cartStore"
  import CartItem from "./CartItem"
  import { Button } from "@/components/ui/button"
  import { useNavigate } from "react-router-dom"
  
  export default function CartDrawer() {
  
    const navigate = useNavigate()
  
    const items = useCartStore((state) => state.items)
  
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  
    const itemCount = items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  
    return (
      <Sheet>
  
        {/* Cart Icon + Badge */}
        <SheetTrigger className="relative">
  
          <ShoppingCart size={22} />
  
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
  
        </SheetTrigger>
  
        <SheetContent>
  
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
  
          <div className="mt-6 space-y-4">
  
            {/* Empty Cart */}
            {items.length === 0 && (
              <div className="flex flex-col items-center py-20 text-gray-500">
  
                <ShoppingCart size={40} />
  
                <p className="mt-3">
                  Your cart is empty
                </p>
  
              </div>
            )}
  
            {/* Cart Items */}
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
  
            {/* Checkout Section */}
            {items.length > 0 && (
  
              <div className="pt-4 border-t space-y-4">
  
                <p className="font-semibold">
                  Total: ₹{total}
                </p>
  
                <Button
                  className="w-full"
                  onClick={() => navigate("/checkout")}
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