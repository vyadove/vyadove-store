"use client";

import { Button } from "@medusajs/ui";
import { useState, useMemo } from "react";
import ProductPrice from "../product-price/product-price";
import { useCart } from "react-use-cart";
import Divider from "../../divider";
import OptionSelect from "./option-select";
import type { Product } from "@/payload-types";

type ProductActionsProps = {
    product: Product;
    setSelectedOptions: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;
    selectedOptions: Record<string, string>;
};

export default function ProductActions({
    product,
    setSelectedOptions,
    selectedOptions,
}: ProductActionsProps) {
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCart();

    const options = useMemo(() => {
        const optionsMap = new Map();

        for (const { options } of product.variants || []) {
            for (const { option, value } of options || []) {
                if (!optionsMap.has(option)) {
                    optionsMap.set(option, new Set());
                }
                optionsMap.get(option).add(value);
            }
        }

        return Array.from(optionsMap.entries()).map(([option, values]) => ({
            name: option,
            values: Array.from(values) as string[],
        }));
    }, [product.variants]);

    const allOptionsSelected = useMemo(() => {
        return options.every(({ name }) => selectedOptions[name]);
    }, [options, selectedOptions]);

    const handleAddToCart = () => {
        setIsAdding(true);

        const selectedVariant = product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        );

        if (selectedVariant?.id == null) return;

        const newItem = {
            ...selectedVariant,
            gallery: selectedVariant.gallery?.length
                ? selectedVariant.gallery
                : product.variants[0].gallery,
            productName: product.title,
            handle: product.handle,
            currency: product.currency,
            id: `${selectedVariant.id}`,
        };

        setTimeout(() => {
            addItem(newItem, 1);
            setIsAdding(false);
        }, 200);
    };

    const selectedVariant =
        product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        ) || product.variants[0];

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-4">
                {options.map(({ name, values }) => (
                    <OptionSelect
                        key={name}
                        title={name}
                        optionName={name}
                        optionValue={values}
                        options={selectedOptions[name]}
                        updateOption={(option, value) => {
                            setSelectedOptions((prev) => ({
                                ...prev,
                                [option]: value,
                            }));
                        }}
                        data-testid="product-options"
                    />
                ))}
                <Divider />
            </div>

            <ProductPrice
                variant={selectedVariant}
                showFrom={product.variants.length > 1 && !allOptionsSelected}
                currency={product.currency}
            />

            <Button
                onClick={handleAddToCart}
                variant="primary"
                className="w-full h-10"
                isLoading={isAdding}
                data-testid="add-product-button"
                disabled={isAdding || !allOptionsSelected}
            >
                {allOptionsSelected ? "Add to cart" : "Select variant"}
            </Button>
        </div>
    );
}
