"use client";

import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import ExperienceSelector from "@/scenes/product-detail/experience-selector";
import PricingSection from "@/scenes/product-detail/pricing-section";
import ProductActions from "@/scenes/product-detail/product-actions";
import ProductAdditionalInfo from "@/scenes/product-detail/product-additional-info";
import ProductGallery from "@/scenes/product-detail/product-gallery";
import { ProductMetadata } from "@/scenes/product-detail/product-metadata";
import { ProductReviews } from "@/scenes/product-detail/product-reviews";
import { RelatedGifts } from "@/scenes/product-detail/related-gifts";
import useNavStore from "@ui/nav/nav.store";
import {
  TypographyH2,
  TypographyH3,
  TypographyLead,
  TypographyP,
} from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";

import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { toast } from "@/components/ui/hot-toast";

import { useRecentlyViewed } from "@/lib/use-recently-viewed";

type Props = {
  product: Product;
};

// create a product detail context to manage selected options
const ProductDetailContext = React.createContext<{
  product: Product;
  selectedVariant?: Product["variants"][number];
  setSelectedVariant: (id: string) => void;
  participants: number;
  setParticipants: (count: number) => void;
}>({} as any);

export const useProductDetailContext = () =>
  React.useContext(ProductDetailContext);

const ProductDetail: React.FC<Props> = ({ product }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { addItem: trackRecentlyViewed } = useRecentlyViewed();
  const [selectedVariant, setSelectedVariant] = useState<
    Product["variants"][number]
  >(product.variants[0] as any);

  // Participants state - use default from variant.participants
  const getInitialParticipants = (
    variant: Product["variants"][number] | undefined,
  ) => {
    if (!variant) return 1;

    return (variant as any).participants?.default ?? 1;
  };

  const [participants, setParticipants] = useState(() =>
    getInitialParticipants(product.variants[0]),
  );

  // Reset participants when variant changes
  useEffect(() => {
    setParticipants(getInitialParticipants(selectedVariant));
  }, [selectedVariant?.id]);

  const setSelectedVariantFromId = (id: string) => {
    const variant = product.variants.find((v) => v.id === id);

    if (!variant) {
      console.log(`Variant with id ${id} not found`);
      toast.error(`Variant with id ${id} not found`);

      return;
    }

    setSelectedVariant(variant);
  };

  // Track recently viewed product
  useEffect(() => {
    trackRecentlyViewed(product);
  }, [product.id]);

  // Sync State → URL (only if user changes variant)
  useEffect(() => {
    const currentId = searchParams.get("variantId");

    if (selectedVariant?.id && currentId !== selectedVariant.id) {
      const params = new URLSearchParams(searchParams.toString());

      params.set("variantId", selectedVariant.id);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [selectedVariant, router, searchParams]);

  return (
    <ProductDetailContext
      value={{
        product,
        selectedVariant,
        setSelectedVariant: setSelectedVariantFromId,
        participants,
        setParticipants,
      }}
    >
      <div className="mt-6 container mx-auto sm:px-6">
        <div className="mb-6">
          <AppBreadcrumb />
        </div>

        <div className="relative mt-6 flex w-full flex-col gap-10 lg:flex-row">
          {/* Left Column: Gallery */}
          <div className="w-full lg:w-3/5">
            <ProductGallery />
          </div>

          {/* Right Column: Pricing & Options */}
          <div className="w-full lg:w-2/5 flex flex-col gap-8">
            {/* Header Section in Right Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <ProductReviews className="mb-2" />
              </div>

              <TypographyH3
                className="font-medium tracking-tight line-clamp-3"
                data-testid="product-title"
              >
                {product.title}
              </TypographyH3>

              <TypographyP className="text-muted-foreground line-clamp-5">
                {product.description}
              </TypographyP>

              <ProductMetadata className="mt-2" />
            </div>

            <PricingSection />

            {/* Actions */}
            <ProductActions product={product} />

            <ExperienceSelector />
          </div>
        </div>

        {/* Additional Info Section */}
        <ProductAdditionalInfo />
      </div>
    </ProductDetailContext>
  );
};

export default ProductDetail;
