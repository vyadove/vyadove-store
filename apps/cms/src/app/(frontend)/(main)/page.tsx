import type { Metadata } from "next";

import FeaturedProducts from "../_components/featured-products";
import Hero from "../_components/hero";
import { payloadSdk } from "@/utils/payload-sdk";

export const metadata: Metadata = {
    description:
        "A performant frontend eCommerce starter template with Payload CMS and Shopnex.",
    title: "Shopnex eCommerce Starter Template",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const heroSection = await payloadSdk.findGlobal({
        slug: "hero-section",
    });
    const hero = heroSection.type?.find((f) => f.blockType === "hero");

    const featuredCollections = await payloadSdk.find({
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
