import { anyone } from "@/access/roles";
import { type CollectionConfig } from "payload";

import { groups } from "../groups";
import { canAccessOwnCart } from "./access/access-own-cart";
import { sessionCartCreate } from "./hooks/session-cart-create";

export const Carts: CollectionConfig = {
    slug: "carts",
    access: {
        create: anyone,
        delete: canAccessOwnCart,
        read: canAccessOwnCart,
        update: canAccessOwnCart,
    },
    admin: {
        group: groups.customers,
        useAsTitle: "id",
    },
    fields: [
        {
            name: "sessionId",
            type: "text",
            admin: {
                position: "sidebar",
                readOnly: true,
            },
            required: true,
        },
        {
            name: "cartItems",
            type: "array",
            fields: [
                {
                    name: "product",
                    type: "relationship",
                    relationTo: "products",
                    required: true,
                },
                {
                    name: "quantity",
                    type: "number",
                    required: true,
                },
            ],
        },
    ],
    hooks: {
        afterChange: [sessionCartCreate],
        beforeValidate: [
            ({ data, operation }) => {
                if (operation !== "create" || !data) {
                    return;
                }
                const sessionId = crypto.randomUUID();

                data.sessionId = sessionId;
            },
        ],
    },
};
