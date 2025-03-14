import type { StoreSetting } from "@/payload-types";
import { Text, clx } from "@medusajs/ui";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import ShoplyCTA from "../_components/shoply-cta";

export default async function Footer({
    storeSettings,
}: {
    storeSettings: StoreSetting;
}) {
    const payload = await getPayload({ config });
    const collectionsPayload = await payload.find({
        collection: "collections",
        limit: 6,
        sort: "createdAt",
    });

    const collections = collectionsPayload.docs;

    return (
        <footer className="border-t border-ui-border-base w-full">
            <div className="content-container flex flex-col w-full">
                <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
                    <div>
                        <Link
                            href="/"
                            className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
                        >
                            {storeSettings?.name} Store
                        </Link>
                    </div>
                    <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
                        {
                            <div className="flex flex-col gap-y-2">
                                <span className="txt-small-plus txt-ui-fg-base">
                                    Collections
                                </span>
                                <ul
                                    className={clx(
                                        "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                                        {
                                            "grid-cols-2":
                                                (collections?.length || 0) > 3,
                                        }
                                    )}
                                >
                                    {collections.map((c) => (
                                        <li key={c.id}>
                                            <Link
                                                className="hover:text-ui-fg-base"
                                                href={`/collections/${c.handle}`}
                                            >
                                                {c.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                        <div className="flex flex-col gap-y-2">
                            <span className="txt-small-plus txt-ui-fg-base">
                                {storeSettings?.name}
                            </span>
                            <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                                <li>
                                    <a
                                        href="https://github.com/medusajs"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-ui-fg-base"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://docs.medusajs.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-ui-fg-base"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/medusajs/nextjs-starter-medusa"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-ui-fg-base"
                                    >
                                        Source code
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
                    <Text className="txt-compact-small">
                        © {new Date().getFullYear()} {storeSettings?.name}. All
                        rights reserved.
                    </Text>
                    <ShoplyCTA />
                </div>
            </div>
        </footer>
    );
}
