import { builder } from "@builder.io/sdk";
import Head from "next/head";
import React from "react";

import { RenderBuilderContent } from "../components/builder";

interface PageProps {
    params: {
        page: string[];
    };
}

export default async function Page({ params }: PageProps) {
    builder.init("954fa25aa9f845c0ad6a82b2b52c6abd");
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const { page } = await params;
    const content = await builder
        .get("page", {
            cache: true,
            prerender: false,
            userAttributes: {
                urlPath: "/" + (page?.join("/") || ""),
            },
        })
        .toPromise();

    return (
        <>
            <Head>
                <title>{content?.data.title}</title>
            </Head>
            {/* Render the Builder page */}
            <RenderBuilderContent content={content} />
        </>
    );
}
