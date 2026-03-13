import { useParams } from "react-router-dom"
import { useFoods } from "@/hooks/useFoods"
import { useCartStore } from "@/store/cartStore"

export default function FoodDetailsPage() {

  const { id } = useParams()

  const { data: food, isLoading } = useFoods(id!)

  const { addItem, increaseItem, decreaseItem, items } = useCartStore()

  if (isLoading) return <div className="p-6">Loading...</div>

  if (!food) return <div className="p-6">Food not found</div>

  const cartItem = items.find((item) => item.id === food.id)

  return (
    <div className="pb-24">

      {/* Image Banner */}
      <div className="w-full h-[300px] overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Food Details */}
      <div className="max-w-4xl mx-auto p-6 space-y-4">

        <h1 className="text-3xl font-bold">
          {food.name}
        </h1>

        <p className="text-gray-500">
          {food.description}
        </p>

        <div className="flex items-center justify-between">

          <span className="text-2xl font-semibold">
            ₹{food.price}
          </span>

          <span className="text-green-600 font-medium">
            ⭐ {food.rating ?? 4.5}
          </span>

        </div>

      </div>

      {/* Sticky Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">

        <div className="max-w-4xl mx-auto flex items-center justify-between">

          <span className="text-xl font-semibold">
            ₹{food.price}
          </span>

          {cartItem ? (

            <div className="flex items-center gap-4">

              <button
                onClick={() => decreaseItem(food.id)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                -
              </button>

              <span className="font-semibold text-lg">
                {cartItem.quantity}
              </span>

              <button
                onClick={() => increaseItem(food.id)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                +
              </button>

            </div>

          ) : (

            <button
              onClick={() =>
                addItem({
                  id: food.id,
                  name: food.name,
                  price: food.price,
                  quantity: 1
                })
              }
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>

          )}

        </div>

      </div>

    </div>
  )
}