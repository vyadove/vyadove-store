import { BeforeChangeHook } from "@/admin/types";
import slugify from "slugify";

import { Category } from "@vyadove/types";

export const syncHandleWithTitle: BeforeChangeHook<Category> = async ({
    data,
    req,
    originalDoc,
}) => {
    // If no title provided, skip
    if (!data?.title) return data;

    const newHandle = slugify(data.title, { lower: true, strict: true });

    // Create only if slug not manually set or if title changed
    const titleChanged = data.title !== originalDoc?.title;

    if (!data?.handle || titleChanged) {
        // Ensure uniqueness
        const existing = await req.payload.find({
            collection: "category",
            where: { handle: { equals: newHandle } },
        });

        let finalSlug = newHandle;
        if (
            existing?.totalDocs > 0 &&
            existing.docs[0].id !== originalDoc?.id
        ) {
            finalSlug = `${newHandle}-${Math.floor(Math.random() * 1000)}`;
        }

        data.handle = finalSlug;
    }

    return data;
};
