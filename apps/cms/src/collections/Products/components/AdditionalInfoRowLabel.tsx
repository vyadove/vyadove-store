"use client";

import { useRowLabel } from "@payloadcms/ui";

export const AdditionalInfoRowLabel = () => {
    const { data, rowNumber } = useRowLabel<{ name?: string }>();

    return <span>{data?.name || `Item ${(rowNumber ?? 0) + 1}`}</span>;
};
