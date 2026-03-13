import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Food } from "@/types/food"

type Props = {
  food: Food
}

export default function FeaturedCard({ food }: Props) {
  return (
    <Card className="w-[220px] hover:shadow-lg transition">

      <CardHeader>
        <CardTitle className="text-lg">
          {food.name}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-500">
          ₹{food.price}
        </p>
      </CardContent>

    </Card>
  )
}