"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { Button } from "@ui/shadcn/button";
import { Card, CardContent } from "@ui/shadcn/card";
import type { CarouselApi } from "@ui/shadcn/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/shadcn/carousel";
import type { Media } from "@vyadove/types";
import Fade from "embla-carousel-fade";
import { type UseEmblaCarouselType } from "embla-carousel-react";
import { motion } from "motion/react";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { cn } from "@/lib/utils";

type ThumbPropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
};

export const Thumb: React.FC<ThumbPropType> = (props) => {
  const { selected, index, onClick } = props;

  return (
    <div
      className={"embla-thumbs__slide".concat(
        selected ? " embla-thumbs__slide--selected" : "",
      )}
    >
      <button
        className="embla-thumbs__slide__number"
        onClick={onClick}
        type="button"
      >
        {index + 1}
      </button>
    </div>
  );
};

type PropType = {
  someProps?: any;
};

const ProductGallery: React.FC<PropType> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaThumbsApi, setEmblaThumbsApi] = useState<CarouselApi>();
  const [emblaMainApi, setEmblaMainApi] = useState<CarouselApi>();

  const { selectedVariant } = useProductDetailContext();

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="sticky top-10 flex flex-col self-start">
      <Carousel
        className="relative w-full"
        plugins={[Fade()]}
        setApi={(api) => {
          if (!api) return;
          setEmblaMainApi(api);
        }}
      >
        <CarouselContent>
          {selectedVariant?.gallery?.map((media, index) => {
            if (typeof media === "number" || !media) return null;

            return (
              <CarouselItem className="" key={index}>
                <InvertedCornerMask
                  className="w-full bg-[#2A4A3A]/10"
                  cornerContent={
                    <div className="flex items-center justify-center gap-3 p-4 py-3">
                      <CarouselPrevious className="bg-accent/40 relative inset-0 z-40 translate-0   text-black " />
                      <CarouselNext className="bg-accent/40 relative  inset-0 z-40 translate-0  text-black  " />
                    </div>
                  }
                  cornersRadius={15}
                  invertedCorners={{
                    tr: { inverted: true, corners: [15, 15, 15] },
                  }}
                >
                  <div className="w-full rounded-2xl ">
                    <div
                      className={cn(
                        "rounded-2xl flex relative w-full min-h-[35rem] border z-0",
                        "",
                      )}
                    >
                      <Image
                        alt={media?.alt || "Product image"}
                        className="absolute inset-0 h-full  object-cover"
                        fill
                        src={media.url || ""}
                      />
                    </div>
                  </div>
                </InvertedCornerMask>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/*<CarouselPrevious className="left-1 z-40" />*/}
        {/*<CarouselNext className="right-1 z-40" />*/}
      </Carousel>

      <Carousel
        className="w-full"
        onKeyDown={() => {
          console.log("handleKeyDown");
        }}
        opts={{
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        setApi={(api) => {
          setEmblaThumbsApi(api);
        }}
      >
        <CarouselContent className="flex cursor-grab pl-4">
          {selectedVariant?.gallery?.map((media, index) => {
            if (typeof media === "number" || !media) return null;

            return (
              <CarouselItem
                className="max-w-28 cursor-pointer px-1.5 py-4"
                key={index}
                onClick={() => {
                  emblaMainApi?.scrollTo(index);
                }}
              >
                <div
                  className={cn(
                    "relative w-full h-full opacity-50 aspect-square border-2 ring-4 ring-accent/30 rounded-2xl",
                    "hover:opacity-80 hover:ring-accent/70 z-0 transition-all",
                    index === selectedIndex &&
                      "ring-accent hover:ring-accent hover:opacity-100 opacity-100 ",
                  )}
                >
                  <Image
                    alt={media?.alt || "Product image"}
                    className="h-full w-full rounded-2xl object-cover transition-all"
                    fill
                    src={media.url || ""}
                  />

                  {index === selectedIndex && (
                    <motion.div
                      className="bg-accent absolute -bottom-4 z-10 h-2 w-4 justify-self-center rounded-md"
                      layoutId="indicator"
                    />
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductGallery;
