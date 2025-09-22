import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductListing } from '@/components/product/product-listing'
import { getProducts, getCategories } from '@/lib/products'

// Enable ISR for dynamic multi-tenant pages
export const revalidate = 3600

interface ProductsPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts()
  const categories = await getCategories()
  const searchQuery = (await searchParams).search

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
              </h1>
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Found products matching "${searchQuery}"`
                  : 'Discover our complete collection of premium products'}
              </p>
            </div>
            <ProductListing
              products={products}
              categories={categories}
              initialSearchQuery={searchQuery}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
