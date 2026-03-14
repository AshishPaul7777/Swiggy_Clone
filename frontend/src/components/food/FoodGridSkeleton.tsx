import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  count?: number
}

export default function FoodGridSkeleton({ count = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border bg-white p-0 shadow-sm"
        >
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
