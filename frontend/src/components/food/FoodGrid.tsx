import { useFoods } from "@/hooks/useFoods"
import FoodCard from "./FoodCard"
import type { Food } from "@/types/food"
import FoodGridSkeleton from "./FoodGridSkeleton"

type Props = {
  categoryId?: string | null
  foods?: Food[]
  isLoadingOverride?: boolean
}

export default function FoodGrid({
  categoryId,
  foods,
  isLoadingOverride = false
}: Props) {
  const {
    data,
    isLoading,
    isError
  } = useFoods(categoryId ?? undefined)

  const list = foods ?? data ?? []
  const showLoading = isLoadingOverride || (isLoading && !foods)

  if (showLoading) return <FoodGridSkeleton />
  if (isError && !foods) return <p>Unable to load foods right now.</p>
  if (list.length === 0) return <p>No foods found.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {list?.map((food: Food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  )
}
