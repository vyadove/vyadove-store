"use client";

import type React from "react";

import { notFound } from "next/navigation";
import ImageGallery from "../_components/products/image-gallery/image-gallary";
import ProductActions from "../_components/products/product-actions/product-actions";
import type { Product } from "@/payload-types";
import ProductInfo from "./product-info";
import ProductTabs from "../_components/products/product-tabs/product-tabs";
import { useState } from "react";

type ProductTemplateProps = {
    product: Product;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product }) => {
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string>
    >({});
    const selectedVariant =
        product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        ) || product.variants[0];
    if (!product || !product.id) {
        return notFound();
    }

    return (
        <>
            <div
                className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
                data-testid="product-container"
            >
                <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
                    <ProductInfo product={product} />
                    <ProductTabs product={product} />
                </div>
                <div className="block w-full relative">
                    <ImageGallery thumbnail={selectedVariant.imageUrl} />
                </div>
                <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
                    <ProductActions
                        product={product}
                        setSelectedOptions={setSelectedOptions}
                        selectedOptions={selectedOptions}
                    />
                </div>
            </div>
            {/* <div className="content-container my-16 small:my-32" data-testid="related-products-container">
        <Suspense fallback={null}>
          <RelatedProducts product={product} />
        </Suspense>
      </div> */}
        </>
    );
};

export default ProductTemplate;
