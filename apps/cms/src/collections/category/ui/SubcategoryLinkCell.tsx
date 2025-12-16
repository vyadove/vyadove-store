"use client";

import React from "react";
import Link from "next/link";
import { useConfig, useDocumentInfo } from "@payloadcms/ui";
// import { useConfig } from "@payloadcms/ui";

export default function SubcategoryLinkCell({
    cellData,
    rowData,
    ...rest
}: any) {
    const { config } = useConfig();

    const info = useDocumentInfo();

    console.log("rowdata -- - : ", rest);

    if (!rowData?.id || !cellData) return <span>- klajs</span>;

    // Build admin edit link for this subcategory
    const editUrl = `${config.routes.admin}/collections/category/${rowData.id}`;

    return (
        <Link
            href={editUrl}
            style={{
                color: "var(--theme-elevation-600)",
                textDecoration: "none",
                fontWeight: 500,
            }}
        >
            {cellData}
        </Link>
    );
}
