"use client";

import React, { useEffect, useRef } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { BsTypeH4 } from "react-icons/bs";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import VariantImages from "@/app/(store)/shop/[slug]/variant-selector/variant-images";
import { Button } from "@ui/shadcn/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyLarge,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";
// import Swiper core and required modules
import { A11y, Pagination } from "swiper/modules";
import { Swiper, type SwiperRef, SwiperSlide } from "swiper/react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

import { cn } from "@/lib/utils";

import "./variant-selector.css";

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
  const swiperRef = useRef<SwiperRef>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the current collection ID from the URL. Defaults to 'all'.
  const selectedVariantId = searchParams.get("variantId");

  const handleValueChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    newSearchParams.set("variantId", value);

    // Use router.push to update the URL without triggering a full page reload
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // useEffect(() => {
  //   if (selectedVariantId) return;
  //
  //   const newSearchParams = new URLSearchParams(searchParams.toString());
  //
  //   newSearchParams.set("variantId", "0");
  //   router.push(`?${newSearchParams.toString()}`, { scroll: false });
  // }, [selectedVariantId]);

  return (
    <div className={cn("my-8 flex flex-col gap-6")}>
      <header className="flex w-full items-center justify-between">
        <div>
          <TypographyH1 className="lg:text-4xl">Variants</TypographyH1>
          <TypographyP className="text-muted-foreground max-w-xl">
            that suits your interests and desires.
          </TypographyP>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            className="bg-accent-foreground cursor-pointer text-black md:size-12"
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slidePrev();
              }
            }}
            size="icon-lg"
          >
            <AiOutlineArrowLeft className="" />
          </Button>

          <Button
            className="bg-accent-foreground cursor-pointer text-black md:size-12"
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slideNext();
              }
            }}
            size="icon-lg"
          >
            <AiOutlineArrowRight />
          </Button>
        </div>
      </header>

      <Swiper
        className="relative w-full max-w-full !pb-10"
        grabCursor
        modules={[Pagination, A11y]}
        navigation
        pagination={{ clickable: true }}
        ref={swiperRef}
        scrollbar={{ draggable: true }}
        slidesPerView="auto"
        spaceBetween={16}
      >
        {models.map((model, idx) => {
          const isVariantSelected = idx.toString() === selectedVariantId;

          return (
            <SwiperSlide className="h-full max-w-[15.3rem]" key={idx}>
              <a
                className={cn(
                  "rounded-2xl  flex flex-col gap-1",
                  isVariantSelected && "bg-accent-foreground",
                )}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleValueChange(idx.toString());
                }}
              >
                <div className="flex h-full w-full flex-col">
                  <VariantImages images={[]} isActive={isVariantSelected} />

                  {/* TEXT DETAILS --- */}
                  <div
                    className={cn(
                      "rounded-bl-xl rounded-br-xl flex flex-col gap-1 p-2",
                      isVariantSelected && "border-2 border-accent-foreground",
                    )}
                  >
                    <TypographyMuted className="text-muted-foreground line-clamp-1">
                      Addis Abeba - Skylight
                    </TypographyMuted>
                    <TypographyP className="line-clamp-3 leading-6 ">
                      Visit to York&#39;s Chocolate Story with Guide Book,
                      Fondue and Chocolates for Two Adults and Two Children
                    </TypographyP>
                    <TypographyH5 className="mt-1 font-semibold">Br 5,000</TypographyH5>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default VariantSelector;
