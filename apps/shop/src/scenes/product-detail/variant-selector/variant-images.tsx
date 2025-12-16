"use client";

import React, { useRef } from "react";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Carousel, CarouselContent, CarouselItem } from "@ui/shadcn/carousel";
import { RadioGroup, RadioGroupItem } from "@ui/shadcn/radio-group";
import type { Product } from "@vyadove/types";
import { type SwiperRef } from "swiper/react";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { cn } from "@/lib/utils";

type Props = {
  images: Product["variants"];
  isActive?: boolean;
};

const models = [
  {
    name: "v0-1.5-sm",
    description: "Everyday tasks and UI generation.",
    image:
      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
    credit: "Valeria Reverdo on Unsplash",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image:
      "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
    credit: "Michael Oeser on Unsplash",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image:
      "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
    credit: "Michael Oeser on Unsplash",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image:
      "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
    credit: "Michael Oeser on Unsplash",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image:
      "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
    credit: "Michael Oeser on Unsplash",
  },
  {
    name: "v0-2.0-mini",
    description: "Open Source model for everyone.",
    image:
      "https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop",
    credit: "Cherry Laithang on Unsplash",
  },
];

const VariantImages = ({ images, isActive }: Props) => {
  const swiperRef = useRef<SwiperRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the current collection ID from the URL. Defaults to 'all'.
  const variantId = searchParams.get("variantId");

  const handleValueChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      // Remove the parameter if 'all' is selected
      newSearchParams.delete("collectionId");
    } else {
      newSearchParams.set("collectionId", value);
    }

    // Use router.push to update the URL without triggering a full page reload
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <InvertedCornerMask
      className="w-full bg-[#2A4A3A]/10"
      cornerContent={
        <div
          className={cn(
            ` items-center  justify-center gap-2 p-2 `,
            // !isActive && 'hidden'
          )}
        >
          {/*<MdOutlineRadioButtonChecked className="" />*/}
          <RadioGroup>
            <RadioGroupItem checked={isActive} value="" />
          </RadioGroup>
        </div>
      }
      cornersRadius={15}
      invertedCorners={{
        tr: { inverted: true, corners: [15, 15, 15] },
      }}
    >
      <div
        className={cn("group/thumbnails relative z-0 w-full overflow-hidden")}
      >
        <Carousel className="relative w-full" setApi={(api) => {}}>
          <CarouselContent>
            {models?.map((media, index) => {
              if (typeof media === "number" || !media) return null;

              return (
                <CarouselItem className="" key={index}>
                  <div className="w-full rounded-2xl ">
                    <div
                      className={cn(
                        "rounded-2xl flex relative w-full min-h-[10rem] border z-0",
                        "",
                      )}
                    >
                      <Image
                        alt={media?.name || "Product image"}
                        className="absolute inset-0 h-full  object-cover"
                        fill
                        src={media.image || ""}
                      />
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {/*<CarouselPrevious className="left-1 z-40" />*/}
          {/*<CarouselNext className="right-1 z-40" />*/}
        </Carousel>
      </div>
    </InvertedCornerMask>
  );
};

export default VariantImages;
