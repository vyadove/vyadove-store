"use client";

import React, { useCallback } from "react";
import { Button, toast, useField, useFormFields } from "@payloadcms/ui";
import { reduceFieldsToValues } from "payload/shared";
import { ClientFieldProps } from "payload";

type Option = {
    id: string;
    value: string[];
    option: string;
};

type VariantOption = {
    option: string;
    value: string;
};

type Variant = {
    vid: string | null;
    imageUrl: string | null;
    price: number | null;
    originalPrice: number | null;
    options: VariantOption[];
    gallery: string[];
};

/**
 * Generates all possible variant combinations for given options.
 * Each option is combined with every other option by generating a Cartesian product.
 */
function generateVariantCombinations(options: Option[]): Variant[] {
    if (options.length === 0) return [];

    // Generate Cartesian product of options.
    const combinations = options.reduce<VariantOption[][]>(
        (acc, option) =>
            acc.flatMap((combo) =>
                option.value.map((value) => [
                    ...combo,
                    { option: option.option, value },
                ])
            ),
        [[]]
    );

    return combinations.map((combo) => ({
        vid: null,
        imageUrl: null,
        price: null,
        originalPrice: null,
        options: combo,
        gallery: [],
    }));
}

const VariantGenerator = ({ path }: ClientFieldProps & { path: string }) => {
    const { setValue } = useField({ path });

    const options = useFormFields(([fields]) =>
        Object.entries(fields)
            .filter(([key]) => key.startsWith("variantOptions."))
            .reduce<Record<string, any>>((acc, [key, field]) => {
                acc[key] = field;
                return acc;
            }, {})
    );

    const { variantOptions } = reduceFieldsToValues(options, true);

    const fieldDispatch = useFormFields(([, dispatch]) => dispatch);

    const handleBuildVariants = useCallback(() => {
        // Shift generation logic here so that variantOptions is freshly read
        // If variantOptions is undefined or empty, it safely returns an empty array.
        const variants = generateVariantCombinations(variantOptions || []);

        variants.forEach((variant, index) => {
            fieldDispatch({
                rowIndex: index,
                type: "ADD_ROW",
                path: "variants",
            });

            [
                { path: `variants.${index}.vid`, value: variant.vid },
                { path: `variants.${index}.imageUrl`, value: variant.imageUrl },
                { path: `variants.${index}.price`, value: variant.price },
                {
                    path: `variants.${index}.originalPrice`,
                    value: variant.originalPrice,
                },
            ].forEach(({ path, value }) => {
                fieldDispatch({ type: "UPDATE", path, value });
            });

            variant.options.forEach((option, optionIndex) => {
                fieldDispatch({
                    type: "UPDATE",
                    path: `variants.${index}.options.${optionIndex}.option`,
                    value: option.option,
                });
                fieldDispatch({
                    type: "UPDATE",
                    path: `variants.${index}.options.${optionIndex}.value`,
                    value: option.value,
                });
            });
        });

        toast.success("Variants built successfully!");
        // Call setValue once after variants have been built if needed.
        setValue("");
    }, [fieldDispatch, variantOptions, setValue]);

    return <Button onClick={handleBuildVariants}>Build Variants</Button>;
};

export default React.memo(VariantGenerator);
