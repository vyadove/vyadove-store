import type { Field } from "payload";
import { formatSlug } from "@/utilities/formatSlug";

export const handleField = (fieldToUse = "title"): Field => ({
    name: "handle",
    type: "text",
    admin: {
        position: "sidebar",
        readOnly: true,
    },
    hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
    },
    index: true,
});
