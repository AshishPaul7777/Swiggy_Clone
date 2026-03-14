import { Skeleton } from "@/components/ui/skeleton"

export default function FeaturedCarouselSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-56 rounded-xl" />

      <div className="grid gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
