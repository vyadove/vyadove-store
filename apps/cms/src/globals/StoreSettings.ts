import type { GlobalConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import currencyCodes from "currency-codes";
import { groups } from "@/collections/groups";

// All available currencies from ISO 4217 standard
const allCurrencyOptions = currencyCodes.codes().map((code) => ({
    label: `${currencyCodes.code(code)?.currency} (${code})`,
    value: code,
}));

const StoreSettings: GlobalConfig = {
    slug: "store-settings",
    access: {
        read: anyone,
        update: admins,
    },
    admin: {
        group: groups.settings,
    },
    hooks: {
        afterChange: [
            async () => {
                // Revalidate shop cache when settings change
                const shopUrl =
                    process.env.NEXT_PUBLIC_SHOP_URL || "http://localhost:3020";
                const secret = process.env.REVALIDATION_SECRET_TOKEN;

                if (!secret) {
                    console.warn(
                        "REVALIDATION_SECRET_TOKEN not set, skipping shop cache invalidation"
                    );
                    return;
                }

                try {
                    await fetch(`${shopUrl}/api/revalidate`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ tag: "store-settings", secret }),
                    });
                    console.log("✓ Shop store-settings cache invalidated");
                } catch (error) {
                    console.error("Failed to invalidate shop cache:", error);
                }
            },
        ],
    },
    fields: [
        {
            name: "name",
            type: "text",
            defaultValue: "Vya-dove",
        },
        {
            type: "tabs",
            tabs: [
                {
                    label: "General",
                    fields: [
                        {
                            name: "baseCurrency",
                            type: "select",
                            label: "Base Currency",
                            defaultValue: "USD",
                            admin: {
                                description:
                                    "Primary currency for product pricing",
                            },
                            options: allCurrencyOptions,
                        },
                        {
                            name: "supportedCurrencies",
                            type: "select",
                            label: "Supported Currencies",
                            hasMany: true,
                            defaultValue: ["USD"],
                            admin: {
                                description:
                                    "Currencies available for customers to select (from ISO 4217)",
                            },
                            options: allCurrencyOptions,
                        },
                    ],
                },
                {
                    label: "Exchange Rates",
                    fields: [
                        {
                            name: "exchangeRateSource",
                            type: "select",
                            label: "Rate Source",
                            defaultValue: "api",
                            options: [
                                { label: "API (auto-fetch)", value: "api" },
                                { label: "Manual only", value: "manual" },
                            ],
                        },
                        {
                            name: "exchangeRateOverrides",
                            type: "array",
                            label: "Manual Rate Overrides",
                            admin: {
                                description:
                                    "Override API rates with fixed values. Use currency codes from supported currencies.",
                            },
                            fields: [
                                {
                                    type: "row",
                                    fields: [
                                        {
                                            name: "fromCurrency",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                placeholder: "e.g., USD",
                                                description:
                                                    "Source currency code",
                                            },
                                        },
                                        {
                                            name: "toCurrency",
                                            type: "text",
                                            required: true,
                                            admin: {
                                                placeholder: "e.g., EUR",
                                                description:
                                                    "Target currency code",
                                            },
                                        },
                                        {
                                            name: "rate",
                                            type: "number",
                                            required: true,
                                            min: 0,
                                            admin: {
                                                step: 0.0001,
                                                description:
                                                    "e.g., 0.92 for USD→EUR",
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "Price Rounding",
                    fields: [
                        {
                            name: "defaultRoundingRule",
                            type: "select",
                            label: "Default Rounding Rule",
                            defaultValue: "charm",
                            admin: {
                                description:
                                    "Applied to all currencies unless overridden below",
                            },
                            options: [
                                {
                                    label: "Charm pricing (.99)",
                                    value: "charm",
                                },
                                {
                                    label: "Clean pricing (.00)",
                                    value: "clean",
                                },
                                { label: "No rounding", value: "none" },
                            ],
                        },
                        {
                            name: "priceRoundingRules",
                            type: "array",
                            label: "Per-Currency Rounding Rules",
                            admin: {
                                description:
                                    "Override default rounding for specific currencies",
                            },
                            fields: [
                                {
                                    type: "row",
                                    fields: [
                                        {
                                            name: "currency",
                                            type: "select",
                                            required: true,
                                            options: allCurrencyOptions,
                                            admin: {
                                                width: "50%",
                                            },
                                        },
                                        {
                                            name: "rule",
                                            type: "select",
                                            required: true,
                                            defaultValue: "charm",
                                            options: [
                                                {
                                                    label: "Charm pricing (.99)",
                                                    value: "charm",
                                                },
                                                {
                                                    label: "Clean pricing (.00)",
                                                    value: "clean",
                                                },
                                                {
                                                    label: "No rounding",
                                                    value: "none",
                                                },
                                            ],
                                            admin: {
                                                width: "50%",
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        // Legacy field (hidden) for backwards compatibility
        {
            name: "currency",
            type: "select",
            admin: { hidden: true },
            defaultValue: "USD",
            options: allCurrencyOptions,
        },
        {
            name: "emailBranding",
            type: "group",
            label: "Email Branding",
            fields: [
                {
                    name: "logo",
                    type: "upload",
                    relationTo: "media",
                    admin: {
                        description: "Logo displayed in email header",
                    },
                },
                {
                    name: "primaryColor",
                    type: "text",
                    defaultValue: "#000000",
                    admin: {
                        description: "Primary brand color (hex)",
                    },
                },
                {
                    name: "accentColor",
                    type: "text",
                    defaultValue: "#666666",
                    admin: {
                        description: "Accent/secondary color (hex)",
                    },
                },
                {
                    name: "footerText",
                    type: "textarea",
                    defaultValue:
                        "© {{current_year}} Vyadove. All rights reserved.",
                    admin: {
                        description: "Footer text (supports {{current_year}})",
                    },
                },
                {
                    name: "address",
                    type: "text",
                    admin: {
                        description: "Business address for email footer",
                    },
                },
                {
                    name: "socialLinks",
                    type: "group",
                    fields: [
                        { name: "facebook", type: "text" },
                        { name: "instagram", type: "text" },
                        { name: "twitter", type: "text" },
                        { name: "linkedin", type: "text" },
                    ],
                },
                {
                    name: "unsubscribeUrl",
                    type: "text",
                    admin: {
                        description: "Unsubscribe page URL",
                    },
                },
            ],
        },
    ],
    label: "Settings",
};

export default StoreSettings;
