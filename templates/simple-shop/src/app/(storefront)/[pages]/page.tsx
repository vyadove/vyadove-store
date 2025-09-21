import { notFound } from 'next/navigation'
import { Render } from '@measured/puck' // or your custom editor
import { getPageByHandle } from '@/lib/puck-pages'
import { config } from '@/collections/Pages/editor/puck-config'

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  const page = await getPageByHandle({ handle: slug })

  if (!page) return notFound()

  return <Render config={config} data={page.page as any} />
}
