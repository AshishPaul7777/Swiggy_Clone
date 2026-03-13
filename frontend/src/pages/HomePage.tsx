import FeaturedCarousel from "@/components/featured/FeaturedCarousel"
import FoodGrid from "@/components/food/FoodGrid"
import CategoryTabs from "@/components/category/CategoryTabs"

import { useState } from "react"

import { useDebounce } from "@/hooks/useDebounce"
import { useSearchFoods } from "@/hooks/useSearchFoods"

type Props = {
  search: string
}

export default function HomePage({ search }: Props) {

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search)

  const { data: searchResults } = useSearchFoods(debouncedSearch)

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">
        Hell Kitchen 
      </h1>

      <FeaturedCarousel />

      <CategoryTabs
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {search ? (
        <FoodGrid foods={searchResults} />
      ) : (
        <FoodGrid categoryId={selectedCategory} />
      )}

    </div>
  )
}