import { useCategories } from "@/hooks/useCategories"
import type { Category } from "@/types/category"

type Props = {
  selected: string | null
  onSelect: (id: string | null) => void
}

export default function CategoryTabs({ selected, onSelect }: Props) {
  const { data } = useCategories()

  const uniqueCategories = data?.filter(
    (category: Category, index: number, self: Category[]) =>
      index === self.findIndex(
        (c) =>
          c.name?.trim().toLowerCase() ===
          category.name?.trim().toLowerCase()
      )
  )

  return (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
      <button
        className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
          selected === null
            ? "border-zinc-950 bg-zinc-950 text-white"
            : "border-zinc-200 bg-white/90 text-zinc-700 hover:border-orange-200 hover:text-orange-600"
        }`}
        onClick={() => onSelect(null)}
      >
        All
      </button>

      {uniqueCategories?.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
            selected === category.id
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-200 bg-white/90 text-zinc-700 hover:border-orange-200 hover:text-orange-600"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
