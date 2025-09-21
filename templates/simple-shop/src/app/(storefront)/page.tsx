import { Render } from '@measured/puck'
import { notFound } from 'next/navigation'
import { getPageByHandle } from '@/lib/puck-pages'
import { getFeaturedProducts } from '@/lib/products'
import { config } from '@/collections/Pages/editor/puck-config'

// Enable ISR for dynamic multi-tenant pages
export const revalidate = 3600

export default async function HomePage() {
  const page = await getPageByHandle({ handle: 'home' })

  if (!page) return notFound()

  const featuredProducts = await getFeaturedProducts()

  return (
    <Render
      config={config}
      data={page.page as any}
      metadata={{
        featuredProducts,
      }}
    />
  )
}
