"use client";

import React, { useRef } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@ui/shadcn/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyLarge,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";
import { CheckCheckIcon, ChevronLeft, ChevronRight } from "lucide-react";
// import "./variant-selector.css";

// import "swiper/css";
// import "swiper/css/pagination";
// import Swiper core and required modules
import { A11y, Pagination } from "swiper/modules";
import { Swiper, type SwiperRef, SwiperSlide } from "swiper/react";

import InvertedCornerMask from "@/components/inverted-corner-mask";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

import { cn } from "@/lib/utils";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { RadioItem } from "@radix-ui/react-dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@ui/shadcn/radio-group";

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
          className={
          cn(
            ` items-center  justify-center gap-2 p-2 `,
            // !isActive && 'hidden'
          )
          }
        >

          {/*<MdOutlineRadioButtonChecked className="" />*/}
          <RadioGroup>
            <RadioGroupItem checked={isActive} value='' />
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
        <div
          className={cn(
            "opacity-0 absolute left-0 z-10 flex w-full top-1/2 -translate-y-1/2  items-center justify-between p-3 group-hover/thumbnails:opacity-100", // transition visibility
            "transition-opacity",
          )}
        >
          <Button
            className="bg-accent-foreground cursor-pointer text-black md:size-8"
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slidePrev();
              }
            }}
            size="icon-lg"
          >
            <ChevronLeft className="" />
          </Button>

          <Button
            className="bg-accent-foreground cursor-pointer text-black md:size-8"
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slideNext();
              }
            }}
            size="icon-lg"
          >
            <ChevronRight />
          </Button>
        </div>

        <Swiper
          className="mySwiper2 relative overflow-hidden"
          // grabCursor
          modules={[Pagination]}
          navigation
          pagination={{ clickable: true }}
          ref={swiperRef}
          // scrollbar={{ draggable: true }}
        >
          {models.map((model, idx) => (
            <SwiperSlide
              className="h-full overflow-hidden rounded-2xl"
              key={idx}
            >
              <div className="relative h-[15.3rem]  w-full">
                <Image
                  alt={model.name}
                  className="aspect-square w-full rounded-2xl object-cover"
                  fill
                  src={model.image}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </InvertedCornerMask>
  );
};

export default VariantImages;
