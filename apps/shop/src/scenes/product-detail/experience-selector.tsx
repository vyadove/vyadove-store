"use client";

import React from "react";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import {
  TypographyH3,
  TypographyH4,
  TypographyH5,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { Check, Star } from "lucide-react";

import { usePrice } from "@/components/price";

import { cn } from "@/lib/utils";

export default function ExperienceSelector() {
  const { product, selectedVariant, setSelectedVariant } =
    useProductDetailContext();
  const { format } = usePrice();

  if (!product.variants.length) return null;

  // Hide if only 1 variant AND it's basic tier
  if (
    product.variants.length === 1 &&
    product.variants[0]?.pricingTier === "basic"
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
        <TypographyH3 className="text-xl font-normal">
          Choose your experience
        </TypographyH3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {product.variants.map((v, index) => {
          // Cast to include description until types are regenerated
          const variant = v as typeof v & { description?: string };
          const isSelected = selectedVariant?.id === variant.id;
          const isMostPopular = index === 1; // Second variant gets "Most Popular" badge

          return (
            <div
              className={cn(
                "relative flex cursor-pointer flex-col gap-4 rounded-xl border p-6 transition-all hover:border-primary/50 hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                  : "border-border bg-card",
              )}
              key={variant.id}
              onClick={() => variant.id && setSelectedVariant(variant.id)}
            >
              {/* Most Popular Badge */}
              {isMostPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground flex items-center gap-1 shadow-sm">
                  <Star className="size-3 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="flex flex-col gap-1">
                <TypographyH5 className="font-semibold capitalize">
                  {variant.pricingTier}
                </TypographyH5>
                <TypographyH3 className="text-2xl font-bold">
                  {format(variant.price?.amount || 0)}
                </TypographyH3>
              </div>

              {/* Description from CMS */}
              <TypographyMuted className="text-sm line-clamp-2">
                {variant.description || "Experience package"}
              </TypographyMuted>

              {/* Features from variant.options[] - show value only */}
              <ul className="flex flex-col gap-1">
                {variant.options?.length ? (
                  variant.options.map((opt) => (
                    <FeatureItem key={opt.id} text={opt.value} />
                  ))
                ) : (
                  <FeatureItem text="Standard experience" />
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm font-light text-neutral-600">
      <div className="rounded-full bg-neutral-100 p-1">
        <div className="size-1.5 rounded-full bg-neutral-500" />
      </div>
      {text}
    </li>
  );
}
