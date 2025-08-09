import { Product } from "@shopnex/types";

export const getVariantImage = (variant: Product["variants"][0]) => {
    let imageUrl =
        typeof variant.gallery?.[0] === "object"
            ? variant.gallery?.[0]?.url
            : undefined;

    if (imageUrl === null) return;
    return imageUrl;
};
