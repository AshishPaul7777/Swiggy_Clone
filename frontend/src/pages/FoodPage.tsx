import { useParams } from "react-router-dom"
import { useFoods } from "@/hooks/useFoods"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"

export default function FoodPage() {

  const { id } = useParams()

  const { data: food, isLoading } = useFoods(id!)

  const addItem = useCartStore((state) => state.addItem)

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <img
        src={food.image}
        alt={food.name}
        className="w-full h-80 object-cover rounded-xl"
      />

      <h1 className="text-3xl font-bold">
        {food.name}
      </h1>

      <p className="text-gray-600">
        {food.description}
      </p>

      <p className="text-xl font-semibold">
        ₹{food.price}
      </p>

      <Button
        onClick={() =>
          addItem({
            id: food.id,
            name: food.name,
            price: food.price,
            quantity: 1
          })
        }
      >
        Add to Cart
      </Button>

    </div>
  )
}