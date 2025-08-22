import { admins } from "@/access/roles";
import { CollectionConfig } from "payload";
import { groups } from "../groups";

export const Plugins: CollectionConfig = {
    slug: "plugins",
    admin: {
        useAsTitle: "name",
        group: groups.plugins,
    },
    access: {
        read: admins,
        create: admins,
        update: admins,
        delete: admins,
    },
    fields: [
        {
            name: "name",
            type: "text",
            admin: {
                readOnly: true,
            },
        },
        {
            name: "description",
            type: "textarea",
            admin: {
                readOnly: true,
            },
        },
        {
            name: "enabled",
            type: "checkbox",
            admin: {
                readOnly: true,
                position: "sidebar",
            },
        },
        {
            name: "pluginId",
            type: "text",
            admin: {
                position: "sidebar",
                readOnly: true,
            },
        },
        {
            name: "svgIcon",
            type: "text",
            admin: {
                readOnly: true,
            },
        },
        {
            name: "category",
            type: "text",
            admin: {
                readOnly: true,
            },
        },
        {
            name: "author",
            type: "text",
            admin: {
                readOnly: true,
                position: "sidebar",
            },
        },
        {
            name: "license",
            type: "text",
            admin: {
                readOnly: true,
                position: "sidebar",
            },
        },
    ],
};
