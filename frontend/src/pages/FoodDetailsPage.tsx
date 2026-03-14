import { Clock3, Flame, MoveLeft, ShieldCheck, Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useFood } from "@/hooks/useFood"
import { useCartStore } from "@/store/cartStore"
import { toast } from "sonner"

export default function FoodDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { data: food, isLoading } = useFood(id)

  const { addItem, increaseItem, decreaseItem, items } = useCartStore()

  if (isLoading) return <div className="p-6">Loading...</div>
  if (!food) return <div className="p-6">Food not found</div>

  const cartItem = items.find((item) => item.id === food.id)

  const handleAddToCart = () => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1
    })

    toast.success(`${food.name} added to cart`)
  }

  return (
    <div className="pb-32">
      <section className="relative overflow-hidden rounded-[34px] bg-zinc-950 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,115,0,0.28),_transparent_38%),linear-gradient(180deg,_rgba(0,0,0,0.1),_rgba(0,0,0,0.78))]" />

        <img
          src={food.image}
          alt={food.name}
          className="h-[360px] w-full object-cover opacity-85 md:h-[460px]"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/50"
          >
            <MoveLeft className="size-4" />
            Back
          </button>

          <div className="rounded-full border border-amber-300/30 bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur-md">
            Chef's Pick
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="max-w-5xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-100 backdrop-blur-sm">
                <Star className="size-4 fill-current" />
                4.5 rating
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-100 backdrop-blur-sm">
                <Clock3 className="size-4 text-orange-300" />
                25-30 mins
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm text-red-100 backdrop-blur-sm">
                <Flame className="size-4 text-orange-300" />
                Hell Kitchen special
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              {food.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-200 md:text-base">
              {food.description || "A bold signature plate built for serious cravings."}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-2 grid max-w-5xl gap-6 px-2 pt-4 md:mt-6 md:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[30px] border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-200/60">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                Signature Dish
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
                Crafted for maximum craving
              </h2>
            </div>

            <div className="rounded-[24px] bg-zinc-950 px-5 py-4 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                Price
              </p>
              <p className="mt-2 text-3xl font-black">
                Rs. {food.price}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-orange-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                Taste Note
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-800">
                Smoky, rich, and stacked with texture
              </p>
            </div>

            <div className="rounded-[24px] bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                Crowd Mood
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-800">
                Comfort food with a premium punch
              </p>
            </div>

            <div className="rounded-[24px] bg-zinc-100 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Kitchen Promise
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-800">
                Freshly prepared and packed hot
              </p>
            </div>
          </div>
        </article>

        <aside className="rounded-[30px] bg-zinc-950 p-7 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-300">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-zinc-200">
                Kitchen Note
              </p>
              <p className="text-xs text-zinc-400">
                Curated details for hungry decision-making
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Best With
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">
                Crispy sides and a chilled drink
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Delivery Feel
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">
                Packed to arrive bold, warm, and camera-ready
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/25 to-red-500/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-200">
                Hell Score
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Star className="size-4 fill-amber-300 text-amber-300" />
                <span className="text-lg font-bold">4.5</span>
                <span className="text-sm text-zinc-300">from hungry regulars</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/92 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-black text-zinc-950">
              Rs. {food.price}
            </p>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-3 rounded-full bg-zinc-950 px-3 py-2 text-white shadow-lg">
              <button
                onClick={() => decreaseItem(food.id)}
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
              >
                -
              </button>

              <span className="min-w-8 text-center text-lg font-bold">
                {cartItem.quantity}
              </span>

              <button
                onClick={() => increaseItem(food.id)}
                className="inline-flex size-11 items-center justify-center rounded-full bg-orange-500 text-xl transition hover:bg-orange-400"
              >
                +
              </button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="h-14 rounded-full bg-zinc-950 px-8 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-600"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
