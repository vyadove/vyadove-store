import type { StoreSetting } from "@/payload-types";

import { clx, Text } from "@medusajs/ui";
import config from "@payload-config";
import { PayloadIcon } from "@payloadcms/ui";
import Link from "next/link";
import { getPayload } from "payload";

import { ShopNexIcon } from "../_components/icons/shopnex-icon";
import { StyledRichText } from "../_components/styled-rich-text";

export default async function Footer({
    storeSettings,
}: {
    storeSettings: StoreSetting;
}) {
    const payload = await getPayload({ config });
    const footer = await payload.findGlobal({
        slug: "footer",
    });
    const basicFooter = footer.type?.find(
        (f) => f.blockType === "basic-footer"
    );

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
                                        href="https://github.com/medusajs"
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-ui-fg-base"
                                        href="https://docs.medusajs.com"
                                        rel="noreferrer"
                                        target="_blank"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-ui-fg-base"
                                        href="https://github.com/medusajs/nextjs-starter-medusa"
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
                <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
                    <div className="txt-compact-small">
                        <StyledRichText
                            data={basicFooter?.copyright}
                            properties={{
                                dateYear: new Date().getFullYear(),
                                storeName: storeSettings?.name || "",
                            }}
                        />
                    </div>
                    <div className="flex gap-x-2 txt-compact-small-plus items-center">
                        <StyledRichText data={basicFooter?.poweredBy} />
                        <Link
                            className="-mr-1"
                            href="https://shoplyjs.com"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <ShopNexIcon fill="#9ca3af" />
                        </Link>
                        &{" "}
                        <Link
                            className="size-4"
                            href="https://payloadcms.com/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <PayloadIcon fill="#9ca3af" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
