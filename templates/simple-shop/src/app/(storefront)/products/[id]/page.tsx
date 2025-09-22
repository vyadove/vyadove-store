import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductDetail } from '@/components/product/product-detail'
import { getProduct } from '@/lib/products'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

// Enable ISR for dynamic multi-tenant pages
export const revalidate = 3600

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct((await params).id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetail product={product} />
      </main>
      <Footer />
    </div>
  )
}
