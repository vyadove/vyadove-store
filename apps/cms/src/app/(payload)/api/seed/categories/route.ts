import { NextResponse } from "next/server";
import { seedCategories } from "@/seed/seed-categories";

export async function POST() {
    try {
        console.log("🌱 Starting category seed via API...");
        await seedCategories();
        return NextResponse.json({
            success: true,
            message: "Categories seeded successfully",
        });
    } catch (error: any) {
        console.error("❌ Error seeding categories:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to seed categories",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Use POST method to seed categories",
        endpoint: "/api/seed/categories",
        method: "POST",
    });
}
