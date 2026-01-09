"use client"

import type { BannerGroup } from "@/lib/types/ui/product"
import Autoplay from "embla-carousel-autoplay"
import { Pause, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

interface HeroBannerCarouselProps {
  bannerGroup: BannerGroup
}

export function HeroBannerCarousel2({ bannerGroup }: HeroBannerCarouselProps) {
  const { banners } = bannerGroup
  const [api, setApi] = useState<CarouselApi>()
  const [isPlaying, setIsPlaying] = useState(true)

  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))

  useEffect(() => {
    if (!api) return

    const autoplayInstance = api.plugins().autoplay
    if (!autoplayInstance) return

    if (isPlaying) {
      autoplayInstance.play()
    } else {
      autoplayInstance.stop()
    }
  }, [isPlaying, api])

  return (
    <div className="relative w-full overflow-hidden border-b border-gray-100 py-4">
      <Carousel
        setApi={setApi}
        plugins={[autoplay.current]}
        opts={{
          loop: true,
          align: "center",
          skipSnaps: false,
        }}
        className="w-full"
        onMouseEnter={() => isPlaying && autoplay.current.stop()}
        onMouseLeave={() => isPlaying && autoplay.current.play()}
      >
        <CarouselContent className="-ml-6">
          {banners.map((banner) => (
            <CarouselItem
              key={banner.id}
              className="basis-[85%] pl-6 md:basis-[55%] lg:basis-[50%]"
            >
              <Link
                href={banner.linkUrl ?? "#"}
                className="relative block aspect-3/4 w-full overflow-hidden rounded-[24px] shadow-sm md:aspect-16/10 lg:aspect-2/1"
              >
                <div className="relative block h-full w-full md:hidden">
                  <Image
                    src={banner.mobileImageFileId}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>

                <div className="relative hidden h-full w-full md:block">
                  <Image
                    src={banner.pcImageFileId}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                  />
                </div>

                <div className="bg-linear-to-t` absolute inset-0 flex flex-col justify-end from-black/70 via-black/20 to-transparent p-8 text-white md:p-12">
                  <div className="max-w-[80%]">
                    <h2 className="text-2xl leading-[1.2] font-bold tracking-tight md:text-4xl lg:text-5xl">
                      {banner.title}
                    </h2>
                    {banner.description && (
                      <p className="mt-3 line-clamp-2 text-sm font-medium opacity-80 md:mt-4 md:text-lg">
                        {banner.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 컨트롤 영역 */}
        <div className="absolute right-8 bottom-8 z-20 flex items-center gap-3">
          <div className="flex h-11 items-center overflow-hidden rounded-full border border-white/40 bg-white/80 shadow-xl backdrop-blur-md transition-all hover:bg-white">
            <CarouselPrevious className="static h-full w-12 translate-y-0 cursor-pointer border-none bg-transparent text-black transition-colors hover:bg-white/80 hover:text-black" />
            <div className="h-4 w-px bg-gray-300" />
            <CarouselNext className="static h-full w-12 translate-y-0 cursor-pointer border-none bg-transparent text-black transition-colors hover:bg-white/80 hover:text-black" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 cursor-pointer rounded-full bg-white/80 text-black shadow-xl backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-90"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </Button>
        </div>
      </Carousel>
    </div>
  )
}
