import { ShopNexIcon } from "@/components/icons/shopnex-icon";
import { StyledRichText } from "@/components/styled-rich-text";
import { payloadSdk } from "@/utils/payload-sdk";
import { clx } from "@medusajs/ui";
import Link from "next/link";

export default async function Footer({
    storeSettings,
}: {
    storeSettings: any;
}) {
    const collectionsPayload = await payloadSdk.find({
        collection: "collections",
        limit: 6,
        sort: "createdAt",
    });

    const collections = collectionsPayload.docs;

    return (
        <footer className="border-t border-ui-border-base w-full">
            <div className="content-container flex flex-col w-full">
                <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20">
                    <div>
                        <Link
                            className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
                            href="/"
                        >
                            {storeSettings?.name} Store
                        </Link>
                    </div>
                    <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
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
                        <div className="flex flex-col gap-y-2">
                            <span className="txt-small-plus txt-ui-fg-base">
                                {storeSettings?.name}
                            </span>
                            <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                                <li>
                                    <a
                                        className="hover:text-ui-fg-base"
                                        href="https://github.com/shopnex-ai/shopnex"
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-ui-fg-base"
                                        href="https://docs.shopnex.ai"
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-ui-fg-base"
                                        href="https://github.com/shopnex-ai/shopnex"
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        Source code
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
                        <p className="font-normal font-sans txt-medium txt-compact-small">
                            ShopNex all rights reserved
                        </p>
                        <div className="flex gap-x-2 txt-compact-small-plus items-center">
                            <Link
                                className="font-normal font-sans txt-medium flex gap-x-2 txt-compact-small-plus items-center"
                                href="https://github.com/shopnex-ai/shopnex"
                                rel="noreferrer"
                                target="_blank"
                            >
                                Powered by <ShopNexIcon fill="#9ca3af" />
                            </Link>
                        </div>
                    </div>
                }
            </div>
        </footer>
    );
}
