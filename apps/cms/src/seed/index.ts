import config from "@payload-config";
import { getPayload } from "payload";

import collections from "./collections.json";
import globals from "./globals.json";
import products from "./products.json";

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

    await payload.create({
        collection: "footer-page",
        data: {
            type: [
                {
                    blockName: null,
                    blockType: "basic-footer",
                    copyright: (globals[1].type[0] as any).copyright,
                },
            ],
        },
    });

    const collectionResults = await Promise.all(
        collections.map((collection: any) =>
            payload.create({
                collection: "collections",
                data: collection,
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

    await Promise.all(
        products.map(async (product : any, index: number) => {


            const productResult = await payload.create({
                collection: "products",
                data: {
                    ...product,
                    collections: productCollectionIds[index],
                },
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
