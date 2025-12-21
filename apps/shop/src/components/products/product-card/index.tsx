"use client";

import { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";

import { Routes } from "@/store.routes";
import { Button } from "@/ui/shadcn/button";
import { getProductGallery } from "@/utils";
import {
  TypographyH5,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";
import type { Product } from "@vyadove/types";
import { motion } from "motion/react";

import InvertedCornerMask from "@/components/inverted-corner-mask";
import { Price } from "@/components/price";

import { cn } from "@/lib/utils";

import { useDominantColor } from "./use-dominant-color";

type ProductPreviewProps = {
  product: Product;
  /** Thumbnail size variant */
  size?: "default" | "sm";
};

const thumbnailSizes = {
  default: "h-[270px]",
  sm: "h-[180px]",
};

export const ProductPreview = ({
  product,
  size = "default",
}: ProductPreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { price } = product.variants?.[0] || {};
  const thumbnailUrl = getProductGallery(product)[0]?.url || undefined;
  const { rgb } = useDominantColor(thumbnailUrl);

  // Create a softer version of the color for the glow
  const glowColor = rgb
    ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4)`
    : "rgba(42, 74, 58, 0.4)";

  return (
    <VyaLink
      className="group/card relative flex flex-col rounded-xl p-1"
      href={`${Routes.productLink(product.handle as string)}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.97 : 0,
          scale: isHovered ? 1 : 0.85,
        }}
        className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl"
        initial={{ opacity: 0, scale: 0.85 }}
        style={{ backgroundColor: glowColor }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />

      {/* Card content wrapper with scale effect */}
      <motion.div
        animate={{
          scale: isHovered ? 1 : 1,
          y: isHovered ? 0 : 0,
        }}
        className="relative flex flex-col"
        initial={{ scale: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        {/* --- THUMBNAIL --- */}
        <InvertedCornerMask
          className="w-full"
          cornerContent={
            <div className="flex items-center justify-center gap-2 p-2">
              <Button
                className="bg-accent/40 text-black transition-transform duration-300 group-hover/card:-rotate-45"
                size="icon-lg"
              >
                <AiOutlineArrowRight />
              </Button>
            </div>
          }
          cornersRadius={15}
          invertedCorners={{
            br: { inverted: true, corners: [15, 15, 15] },
          }}
        >
          <div
            className={cn(
              "relative flex w-full items-start overflow-hidden",
              thumbnailSizes[size],
            )}
          >
            {thumbnailUrl && (
              <Image
                alt={product.title || "product image"}
                className="w-full rounded-xl object-cover object-top transition-transform duration-500 group-hover/card:scale-102"
                fill
                src={thumbnailUrl}
              />
            )}
          </div>
        </InvertedCornerMask>

        {/* -- PRODUCT META --- */}
        <div className="flex flex-1 flex-col gap-1 rounded-xl p-2 px-1">
          <TypographyH5
            className="line-clamp-1 font-semibold"
            title={product.title}
          >
            {product.title}
          </TypographyH5>

          <div className="flex items-center gap-2">
            <TypographyMuted className="line-clamp-2 font-light">
              {product.description}
            </TypographyMuted>
          </div>

          <div className="my-auto flex items-center gap-4">
            <TypographyP className="text-[1rem]">
              <Price amount={price?.amount ?? 0} />
            </TypographyP>
          </div>

          <Button className="bg-accent/60 mt-2 hidden self-start">
            Add to Cart
          </Button>
        </div>
      </motion.div>

      {/* Enhanced shadow on hover */}
      {/*<motion.div
        animate={{
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            : "none",
        }}
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl"
        initial={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />*/}
    </VyaLink>
  );
};
