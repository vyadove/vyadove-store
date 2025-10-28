import { CollectionConfig, PayloadRequest } from "payload";

import { admins, anyone } from "@/access/roles";
import { HandleField } from "@/fields/handle";
import { RichTextEditor } from "@/fields/RichTextEditor/RichTextEditor";
import { groups } from "../groups";

export const revalidateShop = async ({
    req,
    doc,
}: {
    req: PayloadRequest;
    doc: any;
}): Promise<void> => {
    req.payload.logger.info(
        `Starting revalidation of shop page due to product update: ${doc.id}`
    );

    try {
        const secret = process.env.REVALIDATION_SECRET_TOKEN;
        if (!secret) {
            req.payload.logger.error(
                `Revalidation secret token is not set in environment variables.`
            );
            return;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/api/revalidate?secret=${secret}&path=/privacy-policy`,
            {
                method: "GET",
            }
        );

        if (response.ok) {
            req.payload.logger.info(
                `Successfully triggered revalidation for shop page due to product update: ${doc.id}`
            );
        } else {
            req.payload.logger.error(
                `Failed to trigger revalidation for shop page. Status: ${response.status} - ${response.statusText}`
            );
        }
    } catch (error: any) {
        req.payload.logger.error(
            `Error during revalidation request for product ${doc.id}: ${error.message}`
        );
    }
};

export const PrivacyPolicyPage: CollectionConfig = {
    slug: "privacy-policy-page",
    access: {
        create: admins,
        delete: admins,
        read: anyone,
        update: admins,
    },
    admin: {
        defaultColumns: ["title", "handle", "createdAt", "updatedAt"],
        // group: "Settings",
        group: groups.design,
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        RichTextEditor({
            name: "description",
            label: "Description",
        }),
        HandleField(),
    ],

    hooks: {
        afterChange: [revalidateShop],
    },
};
