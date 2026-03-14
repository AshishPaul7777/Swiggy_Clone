import { Button } from "@/components/ui/button"
import { useCartStore, type CartItem as CartItemType } from "@/store/cartStore"

type Props = {
  item: CartItemType
}

export default function CartItem({ item }: Props) {
  const { increaseItem, decreaseItem, removeItem } = useCartStore()

  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-zinc-950">
            {item.name}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Rs. {item.price}
          </p>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
            Cart Item
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => decreaseItem(item.id)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-zinc-100 text-lg font-medium text-zinc-900 transition hover:bg-zinc-200"
          >
            -
          </button>

          <span className="min-w-6 text-center font-bold text-zinc-900">
            {item.quantity}
          </span>

          <button
            onClick={() => increaseItem(item.id)}
            className="inline-flex size-10 items-center justify-center rounded-full bg-orange-500 text-lg font-medium text-white transition hover:bg-orange-600"
          >
            +
          </button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="rounded-full px-4"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
