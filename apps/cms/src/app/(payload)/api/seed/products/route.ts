import { NextRequest, NextResponse } from "next/server";
import { seedProducts } from "@/seed/seed-products";

export async function POST(request: NextRequest) {
    try {
        // Get count from query params or body
        const { searchParams } = new URL(request.url);
        const countParam = searchParams.get("count");
        const count = countParam ? parseInt(countParam) : 2500;

        if (count < 1 || count > 5000) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Count must be between 1 and 5000",
                },
                { status: 400 }
            );
        }

        console.log(`🌱 Starting product seed via API (count: ${count})...`);

        const result = await seedProducts(count);

        return NextResponse.json({
            success: true,
            message: `Products seeded successfully`,
            created: result.created,
            errors: result.errors,
            total: count,
        });
    } catch (error: any) {
        console.error("❌ Error seeding products:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to seed products",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Use POST method to seed products",
        endpoint: "/api/seed/products",
        method: "POST",
        parameters: {
            count: "Number of products to generate (default: 2500, max: 5000)",
        },
        examples: [
            "/api/seed/products (generates 2500 products)",
            "/api/seed/products?count=3000 (generates 3000 products)",
        ],
    });
}
