import type { CollectionConfig } from "payload";

import { admins, anyone } from "@/access/roles";

import { groups } from "./groups";
import { formatSlug } from "@/utils";

const generateAltText = (filename: string): string => {
    if (!filename) return "Image description"; // Fallback

    // 1. Remove the file extension (e.g., '.jpg', '.png')
    let alt = filename.split(".").slice(0, -1).join(".");

    // 2. Replace common separators (hyphens and underscores) with spaces
    alt = alt.replace(/[-_]/g, " ");

    // 3. Capitalize the first letter
    if (alt.length > 0) {
        alt = alt.charAt(0).toUpperCase() + alt.slice(1);
    }

    return alt;
};

export const Media: CollectionConfig = {
    slug: "media",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        group: groups.content,
    },
    fields: [
        {
            name: "alt",
            type: "text",
            hooks: {
                beforeValidate: [formatSlug("filename")],
            },
        },
    ],
    upload: true,
    folders: {},
};
