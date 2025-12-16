import type { Plugin } from "payload";

import { cjPlugin } from "@shopnex/cj-plugin";
import { importExportPlugin } from "@shopnex/import-export-plugin";
import { stripePlugin } from "@vyadove/stripe-plugin";
import { builderIoPlugin } from "@shopnex/builder-io-plugin";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";

import { adminPluginAccess, admins } from "./access/roles";
import { paymentCanceled, paymentSucceeded } from "./webhooks";
import { quickActionsPlugin } from "@shopnex/quick-actions-plugin";
import { easyEmailPlugin } from "@shopnex/easy-email-plugin";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { analyticsPlugin } from "@shopnex/analytics-plugin";
import { sidebarPlugin } from "@shopnex/sidebar-plugin";

import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { searchPlugin } from "@payloadcms/plugin-search";

export const plugins: Plugin[] = [
    formBuilderPlugin({}),

    stripePlugin({
        isTestKey: Boolean(process.env.NEXT_PUBLIC_STRIPE_IS_TEST_KEY),
        logs: true,
        paymentCollectionSlug: "payments",
        secretAccess: {
            create: admins,
            read: admins,
            update: admins,
        },
        stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
        stripeWebhooksEndpointSecret:
            process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
        webhooks: {
            "payment_intent.canceled": paymentCanceled,
            "payment_intent.succeeded": paymentSucceeded,
        },
    }),
    importExportPlugin({
        collections: ["products", "orders", "collections"],
        disableJobsQueue: true,
        importCollections: [
            {
                collectionSlug: "products",
            },
            {
                collectionSlug: "collections",
            },
            {
                collectionSlug: "orders",
            },
        ],
    }),
    easyEmailPlugin({
        collectionOverrides: {
            access: {
                create: adminPluginAccess,
                delete: adminPluginAccess,
                read: adminPluginAccess,
                update: adminPluginAccess,
            },
        },
    }),
    quickActionsPlugin({
        position: "before-nav-links",
    }),
    seoPlugin({
        generateURL: ({ doc }) => {
            return `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${doc.handle}`;
        },
        uploadsCollection: "media",
        generateTitle: ({ doc }) => `Vyadove — ${doc.title}`,
        generateDescription: ({ doc }) => {
            return `some description`;
        },
        fields: ({ defaultFields }) => {
            const resultFields = defaultFields.filter(
                (field) => (field as any).name !== "image"
            );
            return resultFields;
        },
    }),
    analyticsPlugin({}),
    sidebarPlugin(),

    vercelBlobStorage({
        enabled: true,
        collections: {
            // If you have another collection that supports uploads, you can add it below
            media: true,
        },
        token: process.env.VYA_READ_WRITE_TOKEN,
    }),
    searchPlugin({
        collections: ["products"],
        searchOverrides: {
            admin: {
                components: {
                    // Disable the broken ReindexButton by providing empty components
                    beforeList: [],
                },
            },
        },
        beforeSync: async ({ originalDoc, searchDoc, payload }) => {
            const { title = "", description = "", category } = originalDoc;

            // Fetch category titles - categories might be IDs or objects
            let categoryText = "";

            if (category) {
                if (Array.isArray(category) && category.length > 0) {
                    // Handle array of categories
                    const categoryTitles = await Promise.all(
                        category.map(async (cat: any) => {
                            // If already an object with title, use it
                            if (typeof cat === "object" && cat?.title) {
                                return cat.title;
                            }
                            // If it's an ID, fetch the category
                            if (
                                typeof cat === "number" ||
                                typeof cat === "string"
                            ) {
                                try {
                                    const categoryDoc = await payload.findByID({
                                        collection: "category",
                                        id: cat,
                                    });

                                    return categoryDoc?.title || "";
                                } catch (error) {
                                    console.error(
                                        "Error fetching category:",
                                        cat,
                                        error
                                    );

                                    return "";
                                }
                            }

                            return "";
                        })
                    );
                    categoryText = categoryTitles.filter(Boolean).join(" ");
                } else if (typeof category === "object" && category?.title) {
                    // Single category object
                    categoryText = category.title;
                } else if (
                    typeof category === "number" ||
                    typeof category === "string"
                ) {
                    // Single category ID
                    try {
                        const categoryDoc = await payload.findByID({
                            collection: "category",
                            id: category,
                        });
                        categoryText = categoryDoc?.title || "";
                    } catch (error) {
                        console.error(
                            "Error fetching category:",
                            category,
                            error
                        );
                    }
                }
            }

            // Combine all searchable text into the title field
            const searchableText = [title, description, categoryText]
                .filter(Boolean)
                .join(" ");

            console.log("Indexing product:", {
                productId: originalDoc.id,
                title,
                description: description?.substring?.(0, 50) || "",
                categoryText,
                categoryRaw: category,
                searchableText: searchableText.substring(0, 150),
            });

            return {
                ...searchDoc,
                title: searchableText,
            };
        },
    }),
];
