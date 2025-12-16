import { Field, ArrayField } from "payload";

export const PricingTierArrayField = () =>
    ({
        name: "pricingTier",
        label: "Pricing Tier Options",
        type: "array",
        maxRows: 3,
        minRows: 1,
        defaultValue: [
            {
                pricingTier: "basic",
                priceModifier: 0,
                gallery: [],
            },
        ],
        // Validation logic for duplicates
        /*validate: (value, args) => {
            if (!Array.isArray(value)) return true;

            const tiers = value.map((v: any) => v.pricingTier);
            const duplicates = tiers.filter(
                (t, i) => t && tiers.indexOf(t) !== i
            );

            if (duplicates.length > 0) {
                return `Duplicate pricing tier(s) found: ${[...new Set(duplicates)].join(", ")}`;
            }

            return true;
        },*/

        fields: [
            {
                name: "pricingTier",
                type: "select",
                admin: {
                    description: "Price tier for this product.",
                },
                defaultValue: "basic",
                label: "Pricing Tier",
                required: true,
                options: [
                    {
                        label: "Basic (default)",
                        value: "basic",
                    },
                    {
                        label: "Premium",
                        value: "premium",
                    },
                    { label: "Luxury", value: "luxury" },
                ],
            },

            {
                name: "gallery",
                type: "upload",
                admin: {
                    components: {
                        // Field: "@/custom/custom-image-field#UploadField",
                    },
                    isSortable: false,
                    description:
                        "Upload specific images for this tier (optional). Leave empty for 'Basic' tier.",
                    condition: (_, siblingData) =>
                        siblingData?.pricingTier !== "basic",
                },
                hasMany: true,
                label: "Image",
                relationTo: "media",
            },

            {
                name: "priceModifier",
                type: "number",
                defaultValue: 0,
                admin: {
                    condition: (_, siblingData) =>
                        siblingData?.pricingTier !== "basic",
                },
            },
        ],
    }) as ArrayField;
