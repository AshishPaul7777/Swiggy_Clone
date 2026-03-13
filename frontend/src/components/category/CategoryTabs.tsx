import { useCategories } from "@/hooks/useCategories"

type Props = {
  selected: string | null
  onSelect: (id: string | null) => void
}

export default function CategoryTabs({ selected, onSelect }: Props) {

  const { data } = useCategories()

  // Remove duplicate categories by id
  const uniqueCategories = data?.filter(
    (category: any, index: number, self: any[]) =>
      index === self.findIndex((c) => c.id === category.id)
  )

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

      {/* All Button */}
      <button
        className={`px-4 py-2 rounded-full border whitespace-nowrap ${
          selected === null ? "bg-black text-white" : "bg-white"
        }`}
        onClick={() => onSelect(null)}
      >
        All
      </button>

      {/* Categories */}
      {uniqueCategories?.map((category: any) => (

        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full border whitespace-nowrap ${
            selected === category.id
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          {category.name}
        </button>

      ))}

    </div>
  )
}