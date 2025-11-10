"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import ProductActions from "@/scenes/product-detail/product-actions";
import ProductGallery from "@/scenes/product-detail/product-gallery";
import ProductInfo from "@/scenes/product-detail/product-info";
import ProductPrice from "@/scenes/product-detail/product-price";
import { RelatedGifts } from "@/scenes/product-detail/related-gifts";
import useNavStore from "@ui/nav/nav.store";
import { TypographyH2, TypographyH3, TypographyP } from "@ui/shadcn/typography";
import type { Product } from "@vyadove/types";

import { AppBreadcrumb } from "@/components/app-breadcrumb";

type Props = {
  product: Product;
  relatedGifts: Product[];
};

// create a product detail context to manage selected options
const ProductDetailContext = React.createContext<{
  product: Product;
  selectedVariant?: Product["variants"][0];
}>({} as any);

export const useProductDetailContext = () =>
  React.useContext(ProductDetailContext);

const ProductDetail: React.FC<Props> = ({ product, relatedGifts }) => {
  const { setDefaultValue } = useNavStore();

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setDefaultValue(true);

    return () => {
      setDefaultValue(undefined);
    };
  }, []);

  return (
    <ProductDetailContext
      value={{
        product,
        selectedVariant: product.variants[0],
      }}
    >
      <div className="mt-24">
        {/*<VariantSelector variants={[]} />*/}

        <div className="ml-2">
          <AppBreadcrumb />
        </div>

        <div className="relative mt-6 grid grid-cols-[1fr_1fr] gap-6">
          <ProductGallery  />

          <div className="relative mt-2 flex w-full flex-col gap-8">
            <div className="flex flex-col gap-3">
              <TypographyH2 className="" data-testid="product-title">
                {product.title}
              </TypographyH2>

              <ProductPrice variant={product.variants[0]} />

              <TypographyP
                className="text-muted-foreground"
                data-testid="product-description"
              >
                {product.description}
              </TypographyP>

              {/*{product.description && (
              <div
                className="prose prose-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
                data-testid="product-description"
              />
            )}*/}
            </div>

            <ProductActions
              product={product}
              selectedOptions={selectedOptions}
            />

            <ProductInfo />
          </div>
        </div>

        <RelatedGifts products={relatedGifts} />
      </div>
    </ProductDetailContext>
  );
};

export default ProductDetail;
