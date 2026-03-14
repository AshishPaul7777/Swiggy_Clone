import { useParams } from "react-router-dom"
import { useFood } from "@/hooks/useFood"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { toast } from "sonner"

export default function FoodPage() {

  const { id } = useParams()

  const { data: food, isLoading } = useFood(id)

  const addItem = useCartStore((state) => state.addItem)

  if (isLoading) return <p>Loading...</p>
  if (!food) return <p>Food not found.</p>

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
        onClick={handleAddToCart}
      >
        Add to Cart
      </Button>

    </div>
  )
}
