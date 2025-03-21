import type { Metadata } from "next";
import Hero from "../_components/hero";
import FeaturedProducts from "../_components/featured-products";
import { getPayload } from "payload";
import config from "@payload-config";

export const metadata: Metadata = {
    title: "Shopnex Ecommerce Starter Template",
    description:
        "A performant frontend ecommerce starter template with Payload CMS and Shopnex.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const payload = await getPayload({ config });

    const heroSection = await payload.findGlobal({
        slug: "hero-section",
    });
    const hero = heroSection.type?.find((f) => f.blockType === "hero");

    const featuredCollections = await payload.find({
        collection: "collections",
        limit: 3,
        sort: "createdAt",
    });

    return (
        <>
            <Hero hero={hero as any} />
            <div className="py-12">
                <ul className="flex flex-col gap-x-6">
                    <FeaturedProducts collections={featuredCollections.docs} />
                </ul>
            </div>
        </>
    );
}
