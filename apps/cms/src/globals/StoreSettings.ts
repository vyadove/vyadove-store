import type { GlobalConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import currency from "currency-codes";
import { groups } from "@/collections/groups";

const StoreSettings: GlobalConfig = {
    slug: "store-settings",
    access: {
        read: anyone,
        update: admins,
    },
    admin: {
        group: groups.settings,
    },
    fields: [
        {
            name: "name",
            type: "text",
            defaultValue: "Vya-dove",
        },
        {
            name: "currency",
            type: "select",
            defaultValue: "USD",
            options: currency.codes().map((code) => ({
                label: `${currency.code(code)?.currency} (${currency.code(code)?.code})`,
                value: code,
            })),
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
