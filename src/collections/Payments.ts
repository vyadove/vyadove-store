import { Block, CollectionConfig } from "payload";
import { groups } from "./groups";

export const ManualProvider: Block = {
    slug: "manualProvider",
    labels: {
        singular: "Manual Provider",
        plural: "Manual Providers",
    },
    fields: [
        {
            name: "methodType",
            label: "Manual Payment Type",
            type: "select",
            options: [
                { label: "Cash on Delivery", value: "cod" },
                { label: "Bank Transfer", value: "bankTransfer" },
                { label: "In-Store Payment", value: "inStore" },
                { label: "Other", value: "other" },
            ],
            required: true,
        },
        {
            name: "instructions",
            label: "Payment Instructions",
            type: "textarea",
            required: true,
            admin: {
                description: "Shown to customers at checkout.",
            },
        },
        {
            name: "details",
            label: "Details",
            type: "array",
            admin: {
                condition: (data) => {
                    const manualProvider = data?.provider.find(
                        (provider: any) =>
                            provider.blockType === "manualProvider"
                    );
                    return manualProvider?.methodType === "bankTransfer";
                },
            },
            fields: [
                {
                    type: "row",
                    fields: [
                        {
                            name: "label",
                            type: "text",
                            required: true,
                        },
                        {
                            name: "value",
                            type: "text",
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
};

export const Payments: CollectionConfig = {
    slug: "payments",
    admin: {
        group: groups.settings,
        useAsTitle: "name",
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "enabled",
            type: "checkbox",
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "provider",
            type: "blocks",
            blocks: [ManualProvider],
            maxRows: 1,
        },
        {
            name: "supportRefunds",
            type: "checkbox",
            admin: {
                position: "sidebar",
            },
        },
    ],
};
