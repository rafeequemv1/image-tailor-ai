
import React from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    title: "Molecular Structure",
  },
  {
    url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    title: "Laboratory Equipment",
  },
  {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=1780&q=80",
    title: "Scientific Data Visualization",
  },
  {
    url: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80",
    title: "Biochemistry Illustration",
  },
  {
    url: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1925&q=80",
    title: "Research Microscope",
  },
];

const MotionCarouselItem = motion(CarouselItem);

export function ThreeDPhotoCarousel() {
  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="mx-auto"
      >
        <CarouselContent>
          {IMAGES.map((image, index) => (
            <MotionCarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/3 pl-4"
              initial={{ scale: 0.9, opacity: 0.6 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-1">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className={cn(
                      "h-80 w-full bg-cover bg-center transition-transform duration-500 ease-in-out hover:scale-110",
                    )}
                    style={{ backgroundImage: `url(${image.url})` }}
                  />
                  <div className="bg-gradient-to-t from-black/60 to-transparent p-4 absolute bottom-0 w-full">
                    <h3 className="font-medium text-white">{image.title}</h3>
                  </div>
                </div>
              </div>
            </MotionCarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative inset-0 translate-y-0" />
          <CarouselNext className="relative inset-0 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
