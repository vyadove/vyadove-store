import config from "@payload-config";
import { getPayload } from "payload";
import categoriesData from "./categories.json";

export const seedCategories = async () => {
    const payload = await getPayload({ config });

    console.log("🌱 Seeding categories...");

    const categoryMap = new Map<string, string>(); // title -> id mapping

    for (const parentCat of categoriesData) {
        console.log(`Creating parent category: ${parentCat.title}`);

        // Create parent category
        const parentResult = await payload.create({
            collection: "category",
            data: {
                title: parentCat.title,
                description: parentCat.description,
                visible: parentCat.visible,
                handle: parentCat.handle,
            },
        });

        categoryMap.set(parentCat.title, parentResult.id.toString());
        console.log(`✓ Created: ${parentCat.title} (ID: ${parentResult.id})`);

        // Create subcategories
        if (parentCat.subcategories && parentCat.subcategories.length > 0) {
            for (const subcat of parentCat.subcategories) {
                const subcatResult = await payload.create({
                    collection: "category",
                    data: {
                        title: subcat.title,
                        description: subcat.description,
                        visible: subcat.visible,
                        parent: parentResult.id, // Link to parent
                    },
                });

                categoryMap.set(subcat.title, subcatResult.id.toString());
                console.log(`  ✓ Created subcategory: ${subcat.title} (ID: ${subcatResult.id})`);
            }
        }
    }

    console.log(`\n✅ Successfully seeded ${categoryMap.size} categories!`);
    return categoryMap;
};

// If run directly
if (require.main === module) {
    (async () => {
        try {
            await seedCategories();
            process.exit(0);
        } catch (error) {
            console.error("❌ Error seeding categories:", error);
            process.exit(1);
        }
    })();
}
