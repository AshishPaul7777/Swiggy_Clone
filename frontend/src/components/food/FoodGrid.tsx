import { useFoods } from "@/hooks/useFoods"
import FoodCard from "./FoodCard"
import type { Food } from "@/types/food"

type Props = {
  categoryId?: string | null
  foods?: Food[]
}

export default function FoodGrid({ categoryId, foods }: Props) {

  const { data, isLoading } = useFoods(categoryId || undefined)

  const list = foods ?? data ?? []

  if (isLoading && !foods) return <p>Loading foods...</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {list?.map((food: Food) => (
        <FoodCard key={food.id} food={food} />
      ))}

    </div>
  )
}