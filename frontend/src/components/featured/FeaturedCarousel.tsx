import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
  } from "@/components/ui/carousel"
  
  import { useFeatured } from "@/hooks/useFeatured"
  
  export default function FeaturedCarousel() {
  
    const { data, isLoading } = useFeatured()
  
    if (isLoading) return <p>Loading...</p>
  
    return (
      <div className="space-y-4">
  
        <h2 className="text-2xl font-bold">
          Featured Dishes
        </h2>
  
        <Carousel opts={{loop:true}}>
  
          <CarouselContent>
  
            {data?.map((food: any) => (
  
              <CarouselItem
                key={food.id}
                className="basis-1/2 md:basis-1/4"
              >
  
  <div className="relative rounded-xl overflow-hidden shadow-lg group">

<img
  src={food.image}
  alt={food.name}
  className="h-48 w-full object-cover transition-transform group-hover:scale-105"
/>

<div className="absolute inset-0 bg-black/40 flex items-end p-4">

  <h3 className="text-white font-semibold text-lg">
    {food.name}
  </h3>

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