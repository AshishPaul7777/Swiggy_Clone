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
      <Card className="overflow-hidden hover:shadow-lg transition">
  
        {/* Clickable area */}
        <div
          onClick={() => navigate(`/food/${food.id}`)}
          className="cursor-pointer"
        >
          {food.image && (
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-44 object-cover"
            />
          )}
  
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {food.name}
            </CardTitle>
          </CardHeader>
        </div>
  
        <CardContent className="pt-0">
          <p className="text-gray-600 font-medium">
            ₹{food.price}
          </p>
        </CardContent>
  
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleAdd}
          >
            Add to Cart
          </Button>
        </CardFooter>
  
      </Card>
    )
  }