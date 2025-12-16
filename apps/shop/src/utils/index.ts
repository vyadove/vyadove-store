import type { Media, Product } from "@vyadove/types";

export { getSessionId } from "./get-session-id";

export const getProductGallery = (
  product: Product,
  selectedVariantId?: string | null,
) => {
  const { gallery, variants } = product;

  const selectedVariant = {
    gallery: [] as Media[],
  };

  if (selectedVariantId) {
    const variant = variants.find((v) => v.id === selectedVariantId);

    if (variant) {
      selectedVariant.gallery = (variant.gallery as Media[]) || [];
    }
  }

  if (typeof gallery[0] === "number") {
    return [];
  }

  return [...selectedVariant?.gallery, ...gallery] as Media[];
};
