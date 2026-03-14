import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Food } from "@/types/food"
import { useCartStore } from "@/store/cartStore"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

type Props = {
  food: Food
}

export default function FoodCard({ food }: Props) {
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1
    })

    toast.success(`${food.name} added to cart`)
  }

  return (
    <Card className="group overflow-hidden rounded-[30px] border border-zinc-200/80 bg-white/92 shadow-lg shadow-zinc-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div
        onClick={() => navigate(`/foods/${food.id}`)}
        className="cursor-pointer"
      >
        {food.image && (
          <div className="relative overflow-hidden">
            <img
              src={food.image}
              alt={food.name}
              loading="lazy"
              decoding="async"
              className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.02),_rgba(0,0,0,0.58))]" />

            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-orange-600 shadow-sm">
              Hot
            </div>

            <div className="absolute bottom-4 left-4 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              ★ 4.5
            </div>
          </div>
        )}

        <CardHeader className="pb-2 pt-5">
          <CardTitle className="text-2xl font-black tracking-tight text-zinc-950">
            {food.name}
          </CardTitle>
        </CardHeader>
      </div>

      <CardContent className="space-y-3 pt-0">
        <p className="text-sm leading-6 text-zinc-500">
          Built for strong cravings and a fast, satisfying bite.
        </p>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-black text-zinc-950">
            Rs. {food.price}
          </p>

          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
            Hell Pick
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-1">
        <Button
          className="h-11 w-full rounded-full bg-zinc-950 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-orange-600"
          onClick={handleAdd}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
