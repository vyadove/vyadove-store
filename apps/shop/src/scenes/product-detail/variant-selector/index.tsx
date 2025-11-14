"use client";

import React, { useRef } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useProductDetailContext } from "@/scenes/product-detail";
import { Badge } from "@ui/shadcn/badge";
import { Button } from "@ui/shadcn/button";
import { Carousel, CarouselContent, CarouselItem } from "@ui/shadcn/carousel";
import { RadioGroupItem } from "@ui/shadcn/radio-group";
import {
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";
import { Circle } from "lucide-react";
import { type SwiperRef } from "swiper/react";

import { cn } from "@/lib/utils";

import { convertToLocale } from "@/utils/money";

type Props = {
  variants: Product["variants"];
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

const VariantSelector = ({ variants }: Props) => {
  const { selectedVariant, setSelectedVariant, product } =
    useProductDetailContext();

  if (
    product.variants?.length <= 1 &&
    product.variants[0]?.pricingTier === "basic"
  ) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-4")}>
      <div className="flex  gap-2">
        <span className="bg-accent h-full w-1" />
        <TypographyH4>Variants </TypographyH4>
      </div>

      <Carousel className="relative w-full">
        <CarouselContent>
          {product.variants.map((variant) => {
            if (!variant.id) return null;

            const isVariantSelected = variant?.id === selectedVariant?.id;
            const isNotBasic = variant.pricingTier !== "basic";

            return (
              <CarouselItem className="h-full max-w-[15rem]" key={variant.id}>
                <Button
                  className={cn(
                    "w-full h-max rounded-xl text-start flex-col justify-items-start items-start px-3 py-4 hover:bg-primary-background",
                    isVariantSelected &&
                      "bg-primary-background border-2 border-primary",
                  )}
                  onClick={(e) => {
                    if (!variant.id) return null;

                    e.preventDefault();
                    setSelectedVariant(variant.id);
                  }}
                  variant="outline"
                >
                  <div className="flex h-full w-full flex-col">
                    {/*<VariantImages images={[]} isActive={isVariantSelected} />*/}

                    {/* TEXT DETAILS --- */}
                    <div
                      className={cn(
                        " flex flex-col gap-2",
                        isVariantSelected && "",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <TypographyMuted className="text-xs">
                          {variant.sku}
                        </TypographyMuted>

                        {isVariantSelected && (
                          <Circle className="fill-primary ring-primary size-3 rounded-full border-none stroke-0 ring-2" />
                        )}
                      </div>

                      <Badge variant="outline">
                        <TypographyP className="text-inherit capitalize">
                          {variant.pricingTier}
                        </TypographyP>
                      </Badge>

                      <TypographyH5 className="mt-1 font-semibold">
                        {convertToLocale({
                          amount: variant.price,
                        })}
                      </TypographyH5>
                    </div>
                  </div>
                </Button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default VariantSelector;
