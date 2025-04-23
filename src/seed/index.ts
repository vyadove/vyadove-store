import { getPayload } from "payload";
import config from "@payload-config";
import products from "./products.json";
import collections from "./collections.json";
import globals from "./globals.json";

const seed = async () => {
    // Get a local copy of Payload by passing your config
    const payload = await getPayload({ config });

    await payload.updateGlobal({
        slug: "store-settings",
        data: {
            name: "ShopNex",
            currency: "USD",
        },
    });

    const backgroundImage = await payload.create({
        collection: "media",
        data: {
            alt: "watch",
            updatedAt: "2025-04-20T04:59:11.486Z",
            createdAt: "2025-04-20T04:59:11.487Z",
            url: "https://pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev/shopnex-images/media/watch-hero.png",
            thumbnailURL:
                "https://pub-e0a548fa3e234baf8e41a8fd95bb8ad5.r2.dev/shopnex-images/media/watch-hero.png",
            filename: `watch-${new Date().getTime()}.png`,
            mimeType: "image/png",
            filesize: 1077498,
            width: 1024,
            height: 1024,
            focalX: 50,
            focalY: 50,
        },
    });

    globals.forEach(async (global: any) => {
        await payload.updateGlobal({
            slug: global.globalType,
            data: { ...global, backgroundImage: backgroundImage.id },
        });
    });

    const collectionResults = await Promise.all(
        collections.map(async (collection: any) => {
            return payload.create({
                collection: "collections",
                data: collection,
            });
        })
    );

    const productCollectionIds = [
        collectionResults[0].id,
        collectionResults[0].id,
        collectionResults[0].id,
        collectionResults[1].id,
        collectionResults[1].id,
        collectionResults[2].id,
    ];

    products.forEach(async (product: any, index) => {
        await payload.create({
            collection: "products",
            data: { ...product, collections: productCollectionIds[index] },
        });
    });
};

// Call the function here to run your seed script
console.log("Seeding...");
await seed();
console.log("Seeding complete!");
process.exit(0);
