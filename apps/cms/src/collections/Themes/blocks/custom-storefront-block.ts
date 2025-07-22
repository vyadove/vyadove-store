import { Block } from "payload";
import _ from "lodash";

export const CustomStorefrontBlock: Block = {
    slug: "custom-storefront-block",
    labels: {
        singular: "Custom Storefront",
        plural: "Custom Storefronts",
    },
    imageURL: "/custom-storefront.png",
    admin: {
        disableBlockName: true,
    },
    fields: [
        {
            label: "Storefront URLs",
            name: "storefrontUrls",
            type: "text",
            hasMany: true,
            admin: {
                placeholder: "https://yourcustomstore.com",
                description:
                    "Optional: Link to your live storefront. Press enter to add multiple values",
            },
        },
    ],
};
