import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CategoryGrid } from "@/components/category/category-grid";
import { getMappedCategories } from "@/lib/products";

export const revalidate = 3600;

export default async function CategoriesPage() {
    const categories = await getMappedCategories();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-bold">
                                Shop by Category
                            </h1>
                            <p className="text-muted-foreground">
                                Explore our curated collections
                            </p>
                        </div>
                        <CategoryGrid categories={categories} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
