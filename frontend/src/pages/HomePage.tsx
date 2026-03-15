import { Suspense, lazy, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { useSearchFoods } from "@/hooks/useSearchFoods"
import { Skeleton } from "@/components/ui/skeleton"

const CategoryTabs = lazy(() => import("@/components/category/CategoryTabs"))
const FeaturedCarousel = lazy(() => import("@/components/featured/FeaturedCarousel"))
const FoodGrid = lazy(() => import("@/components/food/FoodGrid"))

type Props = {
  search: string
}

function SectionHeader({
  label,
  title
}: {
  label: string
  title: string
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
        {label}
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
        {title}
      </h2>
    </div>
  )
}

function FeaturedFallback() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-72 rounded-[30px]" />
      ))}
    </div>
  )
}

function CategoryTabsFallback() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-11 w-28 rounded-full" />
      ))}
    </div>
  )
}

function FoodGridFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-[27rem] rounded-[30px]" />
      ))}
    </div>
  )
}

export default function HomePage({ search }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [deferredSectionsReady, setDeferredSectionsReady] = useState(false)

  const debouncedSearch = useDebounce(search)
  const isSearching = debouncedSearch.trim().length > 0
  const showDeferredSections = isSearching || deferredSectionsReady

  const {
    data: searchResults,
    isLoading: isSearchLoading
  } = useSearchFoods(debouncedSearch)

  useEffect(() => {
    if (isSearching) {
      return
    }

    const revealDeferredSections = () => {
      setDeferredSectionsReady(true)
    }

    if (typeof window === "undefined") {
      revealDeferredSections()
      return
    }

    let timeoutId: number | null = null
    const frameId = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(revealDeferredSections, 150)
    })

    return () => {
      window.cancelAnimationFrame(frameId)

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [isSearching])

  return (
    <div className="space-y-12">
      {isSearching ? (
        <section className="space-y-5">
          <div className="rounded-[30px] border border-orange-100 bg-white px-6 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
              Search results
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
                  Top matches for "{debouncedSearch}"
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-500 md:text-base">
                  Best name and category matches are surfaced first so the most relevant dishes appear immediately.
                </p>
              </div>
              <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                Search mode
              </div>
            </div>
          </div>

          <Suspense fallback={<FoodGridFallback />}>
            <FoodGrid foods={searchResults} isLoadingOverride={isSearchLoading} />
          </Suspense>
        </section>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-[34px] bg-zinc-950 px-6 py-10 text-white shadow-2xl md:px-10 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.34),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0))]" />

            <div className="relative grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-end">
              <div className="space-y-5">
                <p className="text-sm font-bold uppercase tracking-[0.45em] text-orange-400">
                  Hell Kitchen
                </p>

                <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
                  Fiery comfort food with a cinematic appetite.
                </h1>

                <p className="max-w-xl text-sm leading-6 text-zinc-300 md:text-base">
                  Browse smoky biryanis, stacked burgers, late-night cravings, and dishes that look as bold as they taste.
                </p>

                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-zinc-100">
                    Hot right now
                  </span>
                  <span className="rounded-full border border-orange-400/20 bg-orange-500/15 px-4 py-2 text-sm text-orange-100">
                    Chef-curated picks
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-zinc-100">
                    Fast delivery feel
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                    Mood
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Bold, smoky, crave-first.
                  </p>
                </div>

                <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                    Signature
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Editorial food experience, not plain ecommerce.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {showDeferredSections ? (
            <>
              <section className="space-y-4">
                <SectionHeader label="Featured" title="Plates with presence" />

                <Suspense fallback={<FeaturedFallback />}>
                  <FeaturedCarousel />
                </Suspense>
              </section>

              <section className="space-y-4">
                <SectionHeader label="Explore" title="Pick your craving" />

                <Suspense fallback={<CategoryTabsFallback />}>
                  <CategoryTabs
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                </Suspense>
              </section>

              <Suspense fallback={<FoodGridFallback />}>
                <FoodGrid categoryId={selectedCategory} />
              </Suspense>
            </>
          ) : (
            <section className="space-y-6" aria-hidden="true">
              <FeaturedFallback />
              <CategoryTabsFallback />
            </section>
          )}
        </>
      )}
    </div>
  )
}
