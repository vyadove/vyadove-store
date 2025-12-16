import config from "@payload-config";
import type { Category } from "@vyadove/types";
import { getPayload } from "payload";

import { generateProducts } from "./product-generator";

export const seedProducts = async (count: number = 2500) => {
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

    // Create or find a placeholder media for gallery
    console.log("📷 Setting up placeholder media...");
    let placeholderMediaId: number;

    const existingMedia = await payload.find({
        collection: "media",
        where: { alt: { equals: "placeholder-product" } },
        limit: 1,
    });

    if (existingMedia.docs.length > 0) {
        placeholderMediaId = existingMedia.docs[0].id;
        console.log(
            `✓ Using existing placeholder media: ${placeholderMediaId}`
        );
    } else {
        const placeholderMedia = await payload.create({
            collection: "media",
            data: {
                alt: "placeholder-product",
                filename: `placeholder-${Date.now()}.jpg`,
                mimeType: "image/jpeg",
                url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
                thumbnailURL:
                    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=60",
                width: 800,
                height: 600,
            },
        });
        placeholderMediaId = placeholderMedia.id;
        console.log(`✓ Created placeholder media: ${placeholderMediaId}`);
    }

    // Generate products
    const products = generateProducts(count);

    console.log(`\n🏗️  Creating ${products.length} products in database...`);

    let created = 0;
    let errors = 0;
    const batchSize = 10; // Small batches to avoid connection pool exhaustion

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);

        const results = await Promise.allSettled(
            batch.map(async (product) => {
                const categoryId = categoryIdMap.get(product.category);

                const productData = {
                    pid: product.pid,
                    title: product.title,
                    currency: product.currency,
                    visible: product.visible,
                    salesChannels: product.salesChannels,
                    description: product.description,
                    handle: product.handle,
                    variants: product.variants,
                    customFields: product.customFields,
                    gallery: [placeholderMediaId],
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
