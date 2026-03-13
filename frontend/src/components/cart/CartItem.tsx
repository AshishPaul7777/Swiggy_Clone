import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"

type Props = {
  item: any
}

export default function CartItem({ item }: Props) {

  const { increaseItem, decreaseItem, removeItem } = useCartStore()

  return (
    <div className="flex justify-between items-center border-b py-4">

      {/* Item Info */}
      <div>
        <p className="font-medium">{item.name}</p>

        <p className="text-sm text-gray-500">
          ₹{item.price}
        </p>

      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => decreaseItem(item.id)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          -
        </button>

        <span className="font-semibold">
          {item.quantity}
        </span>

        <button
          onClick={() => increaseItem(item.id)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeItem(item.id)}
        >
          Remove
        </Button>

      </div>

    </div>
  )
}