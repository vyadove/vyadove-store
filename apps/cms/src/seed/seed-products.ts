import config from "@payload-config";
import { getPayload } from "payload";
import { generateProducts } from "./product-generator";

// Category name mapping to find category IDs
const categoryMapping: Record<string, string> = {
    "Fine Dining": "Fine Dining",
    "Spa Days": "Spa Days",
    "Air Adventures": "Air Adventures",
    "Cooking Classes": "Cooking Classes",
    "Romantic Getaways": "Romantic Getaways",
    "Wine & Spirits": "Wine & Spirits",
    "Massage Therapy": "Massage Therapy",
    "Birthday Parties": "Birthday Parties",
    "Yoga & Meditation": "Yoga & Meditation",
    "Photography": "Photography",
    "Brewery & Distillery": "Brewery & Distillery",
    "Water Sports": "Water Sports",
    "Afternoon Tea": "Afternoon Tea",
    "Land Adventures": "Land Adventures",
    "Art Classes": "Art Classes",
};

export const seedProducts = async (count: number = 2500) => {
    const payload = await getPayload({ config });

    console.log("🌱 Starting product seeding...");

    // First, get all category IDs
    console.log("📋 Fetching categories...");
    const categoriesResult = await payload.find({
        collection: "category",
        limit: 200,
    });

    const categoryIdMap = new Map<string, string>();
    categoriesResult.docs.forEach((cat: any) => {
        categoryIdMap.set(cat.title, cat.id);
    });

    console.log(`✓ Found ${categoryIdMap.size} categories`);

    // Generate products
    const products = generateProducts(count);

    console.log(`\n🏗️  Creating ${products.length} products in database...`);

    let created = 0;
    let errors = 0;
    const batchSize = 50;

    // Process in batches to avoid overwhelming the database
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async (product, batchIndex) => {
                try {
                    // Find the category ID
                    const categoryId = categoryIdMap.get(product.category);

                    if (!categoryId) {
                        console.warn(`⚠️  Category not found: ${product.category}`);
                    }

                    const productData: any = {
                        pid: product.pid,
                        title: product.title,
                        currency: product.currency,
                        visible: product.visible,
                        salesChannels: product.salesChannels,
                        description: product.description,
                        handle: product.handle,
                        variants: product.variants,
                        customFields: product.customFields,
                    };

                    // Add category if found
                    if (categoryId) {
                        productData.category = [categoryId];
                    }

                    await payload.create({
                        collection: "products",
                        data: productData,
                    });

                    created++;

                    if (created % 100 === 0) {
                        console.log(`  ✓ Created ${created}/${products.length} products...`);
                    }
                } catch (error: any) {
                    errors++;
                    if (errors < 10) {
                        // Only log first 10 errors
                        console.error(`  ❌ Error creating product "${product.title}":`, error.message);
                    }
                }
            })
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
