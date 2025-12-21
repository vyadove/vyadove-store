import React, { useMemo } from "react";

import { useProductDetailContext } from "@/scenes/product-detail/index";
import { usePayloadFindQuery } from "@/scenes/shop/use-payload-find-query";

import { ProductPreview } from "@/components/products/product-card";

export function RelatedGifts() {
  const { product: currentProduct } = useProductDetailContext();

  // Get the first category ID if available
  const categoryId = useMemo(() => {
    const categories = currentProduct?.category;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return null;
    }
    const firstCategory = categories[0];

    return typeof firstCategory === "object" ? firstCategory.id : firstCategory;
  }, [currentProduct?.category]);

  // Fetch related products from same category, excluding current product
  const relatedGifts = usePayloadFindQuery("products", {
    findArgs: {
      where: {
        and: [
          // Same category (if available)
          ...(categoryId ? [{ category: { contains: categoryId } }] : []),
          // Exclude current product
          { id: { not_equals: currentProduct?.id } },
          // Only visible products
          { visible: { equals: true } },
        ],
      },
      sort: "-createdAt",
      limit: 4,
    },
  });

  const products = relatedGifts?.data?.docs;

  // If no products from same category, don't render
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductPreview key={product.id} product={product} />
      ))}
    </div>
  );
}
