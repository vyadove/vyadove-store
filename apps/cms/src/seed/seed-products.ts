import config from "@payload-config";
import type { Category } from "@vyadove/types";
import type { RequiredDataFromCollectionSlug } from "payload";
import { getPayload } from "payload";

import { generateProducts } from "./product-generator";
import { getCategoryImages } from "./types";

interface SeedResult {
    created: number;
    errors: number;
}

export const seedProducts = async (
    count: number = 2500
): Promise<SeedResult> => {
    const payload = await getPayload({ config });

    console.log("🌱 Starting product seeding...");

    // First, get all category IDs
    console.log("📋 Fetching categories...");
    const categoriesResult = await payload.find({
        collection: "category",
        limit: 200,
    });

    const categoryIdMap = new Map<string, number>();
    categoriesResult.docs.forEach((cat: Category) => {
        categoryIdMap.set(cat.title, cat.id);
    });

    console.log(`✓ Found ${categoryIdMap.size} categories`);

    // Create media entries for each category
    console.log("📷 Setting up category-specific media...");
    const mediaCache = new Map<string, number[]>();

    // Generate products
    const products = generateProducts(count);

    console.log(`\n🏗️  Creating ${products.length} products in database...`);

    let created = 0;
    let errors = 0;
    const batchSize = 10;

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);

        const results = await Promise.allSettled(
            batch.map(async (product) => {
                const categoryId = categoryIdMap.get(product.category);

                // Get or create media for this category
                let mediaIds = mediaCache.get(product.category);
                if (!mediaIds) {
                    const images = getCategoryImages(product.category);
                    mediaIds = [];

                    for (let imgIdx = 0; imgIdx < images.length; imgIdx++) {
                        const media = await payload.create({
                            collection: "media",
                            data: {
                                alt: `${product.category}-${imgIdx + 1}`,
                                filename: `${product.category.toLowerCase().replace(/\s+/g, "-")}-${imgIdx + 1}-${Date.now()}.jpg`,
                                mimeType: "image/jpeg",
                                url: images[imgIdx],
                                thumbnailURL: images[imgIdx].replace(
                                    "w=800",
                                    "w=200"
                                ),
                                width: 800,
                                height: 600,
                            },
                        });
                        mediaIds.push(media.id);
                    }
                    mediaCache.set(product.category, mediaIds);
                }

                const productData: RequiredDataFromCollectionSlug<"products"> =
                    {
                        pid: product.pid,
                        title: product.title,
                        currency:
                            product.currency as RequiredDataFromCollectionSlug<"products">["currency"],
                        visible: product.visible,
                        salesChannels: ["all"],
                        description: product.description,
                        handle: product.handle,
                        variants: product.variants.map((v) => ({
                            ...v,
                            pricingTier: v.pricingTier as
                                | "basic"
                                | "premium"
                                | "luxury",
                            price: {
                                amount: v.price.amount,
                                currency: v.price.currency as "USD",
                            },
                        })),
                        customFields: product.customFields,
                        gallery: mediaIds,
                        category: categoryId ? [categoryId] : undefined,
                    };

                await payload.create({
                    collection: "products",
                    data: productData,
                });

                return product.title;
            })
        );

        for (const result of results) {
            if (result.status === "fulfilled") {
                created++;
            } else {
                errors++;
                if (errors <= 5) {
                    console.error(
                        `  ❌ Error:`,
                        result.reason?.message || result.reason
                    );
                }
            }
        }

        console.log(
            `  ✓ Batch ${Math.floor(i / batchSize) + 1}: ${created}/${products.length} created, ${errors} errors`
        );
    }

    console.log(`\n✅ Product seeding complete!`);
    console.log(`   Created: ${created} products`);
    console.log(`   Errors: ${errors} products`);

    return { created, errors };
};

// If run directly
if (require.main === module) {
    const targetCount = parseInt(process.argv[2]) || 2500;

    (async () => {
        try {
            console.log(`🎯 Target: ${targetCount} products`);
            await seedProducts(targetCount);
            process.exit(0);
        } catch (error) {
            console.error("❌ Fatal error seeding products:", error);
            process.exit(1);
        }
    })();
}
