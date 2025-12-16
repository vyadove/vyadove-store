import config from "@payload-config";
import type { RequiredDataFromCollectionSlug } from "payload";
import { getPayload } from "payload";

import collections from "./collections.json";
import globals from "./globals.json";
import products from "./products.json";

type RichTextNode = {
    type: string;
    text?: string;
    children?: RichTextNode[];
};

type RichTextRoot = {
    root: RichTextNode;
};

/**
 * Extract plain text from rich text JSON structure
 */
function extractTextFromRichText(richText: RichTextRoot): string {
    const extractText = (node: RichTextNode): string => {
        if (node.text) return node.text;
        if (node.children) {
            return node.children.map(extractText).join(" ");
        }
        return "";
    };
    return extractText(richText.root).trim();
}

export const seed = async () => {
    const payload = await getPayload({ config });

    console.log("seeding payload :  --");

    const backgroundImage = await payload.create({
        collection: "media",
        data: {
            alt: "watch",
            createdAt: "2025-04-20T04:59:11.487Z",
            filename: `watch-${Date.now()}.png`,
            filesize: 1077498,
            focalX: 50,
            focalY: 50,
            height: 1024,
            mimeType: "image/png",
            thumbnailURL:
                "https://pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev/shopnex-images/media/watch-hero.png",
            updatedAt: "2025-04-20T04:59:11.486Z",
            url: "https://pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev/shopnex-images/media/watch-hero.png",
            width: 1024,
        },
    });

    await payload.create({
        collection: "hero-page",
        data: {
            type: [
                {
                    ctaButtonLink: "/store",
                    ctaButtonText: "Shop Now",
                    subtitle: "With Timeless Men's Watches",
                    title: "Elevate Your Style",

                    backgroundImage: backgroundImage.id,
                    blockName: null,
                    blockType: "hero",
                },
            ],
        },
    });

    // Extract copyright from globals JSON
    const footerGlobal = globals[1] as { type: Array<{ copyright: unknown }> };

    await payload.create({
        collection: "footer-page",
        data: {
            type: [
                {
                    blockName: null,
                    blockType: "basic-footer",
                    copyright: footerGlobal.type[0].copyright,
                },
            ],
        } as RequiredDataFromCollectionSlug<"footer-page">,
    });

    const collectionResults = await Promise.all(
        collections.map((collection) =>
            payload.create({
                collection: "collections",
                data: {
                    title: collection.title,
                    description: collection.description,
                    imageUrl: collection.imageUrl,
                    handle: collection.handle,
                },
            })
        )
    );

    const productCollectionIds = [
        collectionResults[0].id,
        collectionResults[0].id,
        collectionResults[0].id,
        collectionResults[1].id,
        collectionResults[1].id,
        collectionResults[2].id,
    ];

    // Create placeholder media for products gallery (required field)
    const placeholderMedia = await payload.create({
        collection: "media",
        data: {
            alt: "placeholder-product",
            filename: `placeholder-product-${Date.now()}.jpg`,
            mimeType: "image/jpeg",
            url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
            thumbnailURL:
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=60",
            width: 800,
            height: 600,
        },
    });

    await Promise.all(
        products.map(async (product, index: number) => {
            // Transform customFields value from rich text JSON to plain text
            const transformedCustomFields = product.customFields.map(
                (field) => ({
                    name: field.name,
                    // Extract text from rich text structure
                    value:
                        typeof field.value === "string"
                            ? field.value
                            : extractTextFromRichText(field.value),
                })
            );

            const productResult = await payload.create({
                collection: "products",
                data: {
                    ...product,
                    collections: [productCollectionIds[index]],
                    gallery: [placeholderMedia.id], // Required field
                    customFields: transformedCustomFields,
                } as RequiredDataFromCollectionSlug<"products">,
            });

            console.log(`Created product: ${productResult.id}`);
        })
    );
};

// NOTE: Use the API endpoints for seeding instead:
// - POST /api/seed/categories - Seed only categories
// - POST /api/seed/products?count=2500 - Seed only products
// - POST /api/seed/all?count=2500 - Seed everything

// console.log("Seeding...");
// await seed();
// console.log("Seeding complete!");
// process.exit(0);
