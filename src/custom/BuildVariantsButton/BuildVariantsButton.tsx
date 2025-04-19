"use client";

import React, { useCallback, useState } from "react";
import {
    Button,
    toast,
    useAllFormFields,
    useField,
    useForm,
    useFormFields,
} from "@payloadcms/ui";
import { getSiblingData, reduceFieldsToValues } from "payload/shared";

type Option = {
    id: string;
    value: string[];
    option: string;
};

type Variant = {
    [key: string]: string | number | null;
};

type VariantOption = {
    option: string;
    value: string;
};

function buildVariants(options: Option[]) {
    if (options.length === 0) return [];

    // Generate the Cartesian product of options
    const combinations = options.reduce(
        (acc, option) => {
            const result: VariantOption[][] = [];
            for (const combination of acc) {
                for (const value of option.value) {
                    result.push([
                        ...combination,
                        {
                            option: option.option,
                            value,
                        },
                    ]);
                }
            }
            return result;
        },
        [[]] as VariantOption[][]
    );

    // Wrap into full variant structure
    const variants: any = combinations.map((combo) => ({
        vid: null,
        imageUrl: null,
        price: null,
        originalPrice: null,
        options: combo,
        gallery: [],
    }));

    return variants;
}

const VariantGenerator: React.FC = ({ path }: any) => {
    const { setValue } = useField({ path });
    const options = useFormFields(([fields]) => {
        const matchingFields = Object.entries(fields)
            .filter(([key]) => key.startsWith("variantOptions."))
            .reduce(
                (acc, [key, field]) => {
                    acc[key] = field;
                    return acc;
                },
                {} as Record<string, any>
            );

        return matchingFields;
    });

    const { variantOptions } = reduceFieldsToValues(options, true);
    const generatedVariants = buildVariants(variantOptions);

    const fieldDispatch = useFormFields(([, dispatch]) => dispatch);
    const handleBuildVariants = useCallback(() => {
        generatedVariants.forEach((variant: any, index: number) => {
            fieldDispatch({
                rowIndex: index,
                type: "ADD_ROW",
                path: "variants",
            });
            fieldDispatch({
                type: "UPDATE",
                path: `variants.${index}.vid`,
                value: variant.vid,
            });
            fieldDispatch({
                type: "UPDATE",
                path: `variants.${index}.imageUrl`,
                value: variant.imageUrl,
            });
            fieldDispatch({
                type: "UPDATE",
                path: `variants.${index}.price`,
                value: variant.price,
            });
            fieldDispatch({
                type: "UPDATE",
                path: `variants.${index}.originalPrice`,
                value: variant.originalPrice,
            });
            variant.options?.forEach((option: any, optionIndex: number) => {
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
            setValue("");
        });
        toast.success("Variants built successfully!");
    }, [fieldDispatch]);

    return <Button onClick={handleBuildVariants}>Build Variants</Button>;
};

export default VariantGenerator;
