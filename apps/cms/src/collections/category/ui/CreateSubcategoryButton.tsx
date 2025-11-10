"use client";
import React from "react";
// import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Button, useDocumentInfo } from "@payloadcms/ui";
// import { useDocumentInfo } from "payload/components/utilities";

export default function CreateSubcategoryButton() {
    const router = useRouter();
    const { id } = useDocumentInfo(); // current category ID

    if (!id) return null;

    const handleClick = () => {
        router.push(`/admin/collections/category/create?parent=${id}`);
    };

    return (
        <Button onClick={handleClick}  className="mt-3">
            + Create Subcategory
        </Button>
    );
}
