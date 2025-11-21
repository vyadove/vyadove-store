"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import ProductActions from "@/scenes/product-detail/product-actions";
import ProductGallery from "@/scenes/product-detail/product-gallery";
import ProductInfo from "@/scenes/product-detail/product-info";
import ProductPrice from "@/scenes/product-detail/product-price";
import { RelatedGifts } from "@/scenes/product-detail/related-gifts";
import VariantSelector from "@/scenes/product-detail/variant-selector";
import useNavStore from "@ui/nav/nav.store";
import {
  TypographyH2,
  TypographyH3,
  TypographyLead,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";
import { toast } from "@/components/ui/hot-toast";

import { AppBreadcrumb } from "@/components/app-breadcrumb";

type Props = {
  product: Product;
  relatedGifts: Product[];
};

// create a product detail context to manage selected options
const ProductDetailContext = React.createContext<{
  product: Product;
  selectedVariant?: Product["variants"][number];
  setSelectedVariant: (id: string) => void;
}>({} as any);

export const useProductDetailContext = () =>
  React.useContext(ProductDetailContext);

const ProductDetail: React.FC<Props> = ({ product, relatedGifts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setDefaultValue } = useNavStore();
  const [selectedVariant, setSelectedVariant] = useState<
    Product["variants"][number]
  >(product.variants[0] as any);

  const setSelectedVariantFromId = (id: string) => {
    const variant = product.variants.find((v) => v.id === id);

    if (!variant) {
      console.log(`Variant with id ${id} not found`);
      toast.error(`Variant with id ${id} not found`);

      return;
    }

    setSelectedVariant(variant);
  };

  useEffect(() => {
    setDefaultValue(true);

    return () => {
      setDefaultValue(undefined);
    };
  }, []);

  /* useEffect(() => {
    if (selectedVariant) {
      return;
    }

    setSelectedVariant(product.variants[0]);
  }, [selectedVariant]);*/

/*  useEffect(() => {
    const variantId = searchParams.get("variantId");

    if (!variantId) return;

    const variant = product.variants.find((v) => v.id === variantId);

    if (variant && variant.id !== selectedVariant?.id) {
      setSelectedVariant(variant);
    }
  }, [searchParams, product.variants]);*/

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
      }}
    >
      <div className="mt-24">
        <div className="ml-2">
          <AppBreadcrumb />
        </div>

        <div className="relative mt-6 flex w-full flex-col gap-6 sm:flex-row">
          <ProductGallery />

          <div className="relative mt-2 flex w-full max-w-2xl flex-1 flex-col gap-8">
            <div className="flex flex-col gap-3">
              <TypographyMuted className="" data-testid="product-sku">
                {selectedVariant?.sku || "SKU: N/A"}
              </TypographyMuted>

              <TypographyH2
                className="line-clamp-2"
                data-testid="product-title"
              >
                {product.title}
              </TypographyH2>

              <ProductPrice />

              <TypographyP
                className="text-muted-foreground line-clamp-6"
                data-testid="product-description"
              >
                {product.description}
              </TypographyP>
            </div>

            <ProductActions product={product} />

            <VariantSelector variants={product.variants} />

            <ProductInfo />
          </div>
        </div>

        <RelatedGifts products={relatedGifts} />
      </div>
    </ProductDetailContext>
  );
};

export default ProductDetail;
