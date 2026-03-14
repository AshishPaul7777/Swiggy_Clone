import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { useFeatured } from "@/hooks/useFeatured"
import type { Food } from "@/types/food"
import { useNavigate } from "react-router-dom"
import FeaturedCarouselSkeleton from "./FeaturedCarouselSkeleton"

export default function FeaturedCarousel() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useFeatured()

  if (isLoading) return <FeaturedCarouselSkeleton />
  if (isError) return <p>Unable to load featured dishes right now.</p>

  return (
    <div className="space-y-4">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {data?.map((food: Food) => (
            <CarouselItem
              key={food.id}
              className="basis-[82%] sm:basis-1/2 md:basis-[32%]"
            >
              <div
                onClick={() => navigate(`/foods/${food.id}`)}
                className="group relative cursor-pointer overflow-hidden rounded-[30px] border border-white/30 shadow-2xl"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  loading="lazy"
                  decoding="async"
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.05),_rgba(0,0,0,0.72))]" />

                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-orange-200 backdrop-blur-sm">
                  Featured
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight text-white">
                      {food.name}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        ★ 4.5
                      </span>
                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-100 backdrop-blur-sm">
                        Hell Kitchen pick
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
