import { NextRequest, NextResponse } from "next/server";
import { seedCategories } from "@/seed/seed-categories";
import { seedProducts } from "@/seed/seed-products";

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productCount = parseInt(searchParams.get("count") || "2500");

        if (productCount < 1 || productCount > 5000) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product count must be between 1 and 5000",
                },
                { status: 400 }
            );
        }

        console.log(`🌱 Starting full database seed...`);
        console.log(`  - Categories: ~63`);
        console.log(`  - Products: ${productCount}`);

        // Seed categories first
        console.log("\n📁 Step 1/2: Seeding categories...");
        await seedCategories();

        // Seed products
        console.log(`\n📦 Step 2/2: Seeding ${productCount} products...`);
        const productResult = await seedProducts(productCount);

        console.log(`\n✅ Full seed complete!`);

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully",
            categories: "~63 categories created",
            products: {
                created: productResult.created,
                errors: productResult.errors,
                total: productCount,
            },
        });
    } catch (error) {
        console.error("❌ Error during full seed:", error);
        const message =
            error instanceof Error ? error.message : "Failed to seed database";
        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Full database seeding endpoint",
        description: "Seeds both categories and products in the correct order",
        endpoint: "/api/seed/all",
        method: "POST",
        parameters: {
            count: "Number of products to generate (default: 2500, max: 5000)",
        },
        examples: [
            "/api/seed/all (seeds categories + 2500 products)",
            "/api/seed/all?count=3000 (seeds categories + 3000 products)",
        ],
        warning:
            "This will create new records. Make sure your database can handle the volume.",
    });
}
