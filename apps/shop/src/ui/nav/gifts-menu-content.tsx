"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Routes } from "@/store.routes";
import {
  TypographyH6,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";
import type { Category, Collection, Media, Product } from "@vyadove/types";
import { ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

// Filter keys matching shop/components/util.ts
const filterKeys = {
  experiences: "experiences",
  occasions: "occasions",
  price: "price",
} as const;

// Price ranges matching price-filter.tsx
const priceRanges = [
  { label: "Under ETB 1,000", value: "100-1000", min: 100, max: 1000 },
  { label: "ETB 1,000 - 2,000", value: "1000-2000", min: 1000, max: 2000 },
  { label: "ETB 2,000 - 5,000", value: "2000-5000", min: 2000, max: 5000 },
  { label: "ETB 5,000 - 10,000", value: "5000-10000", min: 5000, max: 10000 },
  {
    label: "ETB 10,000 - 20,000",
    value: "10000-20000",
    min: 10000,
    max: 20000,
  },
  { label: "ETB 20,000+", value: "20000-plus", min: 20000 },
];

interface CategoryWithChildren extends Category {
  children?: Category[];
}

interface GiftsMenuContentProps {
  categories: CategoryWithChildren[];
  pinnedCollections: Collection[];
  pinnedProducts: Product[];
}

// Helper to build shop URL with category filter
const buildCategoryUrl = (categoryHandle: string) => {
  return `${Routes.shop}?${filterKeys.experiences}=${categoryHandle}`;
};

// Helper to build shop URL with price filter
const buildPriceUrl = (priceValue: string) => {
  return `${Routes.shop}?${filterKeys.price}=${priceValue}`;
};

// Check if category is "By Price" type (special handling)
const isPriceCategory = (category: Category) => {
  const handle = category.handle?.toLowerCase() || "";
  const title = category.title?.toLowerCase() || "";

  return handle.includes("price") || title.includes("price");
};

export const GiftsMenuContent = ({
  categories,
  pinnedCollections,
}: GiftsMenuContentProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = categories[activeIndex];
  const isPriceActive = activeCategory
    ? isPriceCategory(activeCategory)
    : false;

  return (
    <div className="flex min-h-[380px] overflow-hidden rounded-xl bg-white shadow-2xl">
      {/* Left Column - Main Categories */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-gray-100 bg-gray-50/50 p-3">
        {categories.map((category, index) => (
          <button
            className={cn(
              "group flex gap-2 w-full items-center justify-between px-3 rounded-lg py-2 text-left transition-all duration-200 cursor-pointer",
              " hover:text-primary",
              activeIndex === index
                ? "bg-primary/5 text-primary font-bold shadow-sm"
                : " ",
            )}
            key={category.id}
            onMouseEnter={() => setActiveIndex(index)}
            type="button"
          >
            <Star className="text-primary" size={14} />
            <TypographyH6 className="font-normal mr-auto">
              {category.title}
            </TypographyH6>
            <ChevronRight
              className={cn(
                "size-4 transition-all duration-200",
                activeIndex === index
                  ? "text-primary translate-x-0 opacity-100"
                  : "-translate-x-2 opacity-0",
              )}
            />
          </button>
        ))}

        {/* View All Link */}
        <div className="mt-auto border-t border-gray-100 px-5 pt-4">
          <VyaLink
            className="text-primary text-sm font-medium hover:underline"
            href={Routes.shop}
          >
            View All Gifts
          </VyaLink>
        </div>
      </div>

      {/* Middle Column - Sub-categories or Price Ranges */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-gray-100 p-3">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col px-2 mt-2"
            exit={{ opacity: 0, x: -10 }}
            initial={{ opacity: 0, x: 10 }}
            key={activeCategory?.id}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* Section Header */}
            <TypographySmall className="mb-2 px-3 text-xs font-medium uppercase tracking-wider">
              {isPriceActive ? "Price Range" : activeCategory?.title}
            </TypographySmall>

            {/* Price Ranges (when "By Price" is active) */}
            {isPriceActive &&
              priceRanges.map((range) => (
                <VyaLink
                  className={cn(
                    "rounded-lg px-3 py-2 font-light text-gray-700 transition-all duration-150",
                    "hover:bg-primary/5 hover:text-primary hover:pl-4",
                    "text-sm",
                  )}
                  href={buildPriceUrl(range.value)}
                  key={range.value}
                >
                  {range.label}
                </VyaLink>
              ))}

            {/* Sub-category Links (for non-price categories) */}
            {!isPriceActive &&
              activeCategory?.children?.map((subCat) => (
                <VyaLink
                  className={cn(
                    "rounded-lg px-3 py-2 font-light text-gray-700 transition-all duration-150",
                    "hover:bg-primary/5 hover:text-primary hover:pl-4",
                    "text-sm",
                  )}
                  href={buildCategoryUrl(subCat.handle || "")}
                  key={subCat.id}
                >
                  {subCat.title}
                </VyaLink>
              ))}

            {/* Empty State */}
            {!isPriceActive &&
              (!activeCategory?.children ||
                activeCategory.children.length === 0) && (
                <TypographyMuted className="px-3 py-4">
                  No subcategories yet
                </TypographyMuted>
              )}

            {/* View Category Link */}
            {activeCategory && !isPriceActive && (
              <VyaLink
                className="text-primary mt-3 px-3 text-sm font-medium hover:underline"
                href={buildCategoryUrl(activeCategory.handle || "")}
              >
                Shop All {activeCategory.title}
              </VyaLink>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Column - Pinned Collections */}
      <div className="flex flex-col gap-4 w-[290px] shrink-0 border-r border-gray-100 p-3">
        {pinnedCollections.slice(0, 2).map((collection, idx) => (
          <PinnedCollectionCard
            collection={collection}
            index={idx}
            key={collection.id}
          />
        ))}
      </div>
    </div>
  );
};

const PinnedCollectionCard = ({
  collection,
  index,
}: {
  collection: Collection;
  index: number;
}) => {
  const thumbnail = (collection.thumbnail as Media)?.url;

  // Alternate gradient colors for visual variety
  const gradientStyles = [
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
  ];

  const gradient = gradientStyles[index % gradientStyles.length];

  return (
    <Link
      className="group relative flex h-[170px] overflow-hidden rounded-xl"
      href={Routes.collectionLink(collection.handle || "")}
    >
      {/* Background Gradient */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center p-5">
        <h3 className="text-2xl font-bold leading-tight text-white drop-shadow-sm">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-white/80">
            {collection.description}
          </p>
        )}

        {/* CTA Button */}
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-md transition-transform duration-200 group-hover:scale-105">
          Shop Now
        </span>
      </div>

      {/* Image */}
      {thumbnail && (
        <div className="relative w-[45%] shrink-0">
          <Image
            alt={collection.title || "Collection"}
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            fill
            src={thumbnail}
          />
        </div>
      )}
    </Link>
  );
};

export default GiftsMenuContent;
