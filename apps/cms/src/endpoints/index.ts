import type { Endpoint } from "payload";
import { checkRole } from "@/access/roles";
import { seed } from "@/seed";

export const endpoints: Endpoint[] = [
    {
        handler: () => Response.json({ status: "OK" }),
        method: "get",
        path: "/healthz",
    },
    {
        handler: async (req) => {
            if (!checkRole(["admin"], req?.user)) {
                return Response.json(
                    { status: "UNAUTHORIZED" },
                    { status: 403 }
                );
            }

            try {
                await seed();
                return Response.json({ status: "SEED OK" });
            } catch (error) {
                return Response.json({ status: "ERROR", error });
            }
        },
        method: "get",
        path: "/seed",
    },
    {
        handler: async (req) => {
            if (!checkRole(["admin"], req?.user)) {
                return Response.json(
                    { status: "UNAUTHORIZED" },
                    { status: 403 }
                );
            }

            try {
                // Delete existing search docs
                const existing = await req.payload.find({
                    collection: "search",
                    limit: 10000,
                });
                for (const doc of existing.docs) {
                    await req.payload.delete({
                        collection: "search",
                        id: doc.id,
                    });
                }

                // Re-save all products to trigger search sync
                const products = await req.payload.find({
                    collection: "products",
                    limit: 10000,
                });
                for (const product of products.docs) {
                    await req.payload.update({
                        collection: "products",
                        id: product.id,
                        data: {},
                    });
                }

                return Response.json({
                    status: "REINDEX OK",
                    count: products.docs.length,
                });
            } catch (error) {
                return Response.json(
                    { status: "ERROR", error: String(error) },
                    { status: 500 }
                );
            }
        },
        method: "post",
        path: "/reindex-search",
    },
];
