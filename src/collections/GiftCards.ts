import type { CollectionConfig } from "payload";
import { groups } from "./groups";
import { generateGiftCardCode } from "@/utilities/generate-gift-card-code";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { admins } from "@/access/roles";
import { getClientIp } from "@/utilities/get-client-ip";

const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60, 
});

export const GiftCards: CollectionConfig = {
    slug: "gift-cards",
    admin: {
        useAsTitle: "code",
        group: groups.catalog,
        defaultColumns: ["code", "value", "expiryDate"],
    },
    access: {
        create: admins,
        read: admins,
        update: admins,
        delete: admins,
    },
    fields: [
        {
            name: "code",
            type: "text",
            label: "Card code",
            required: true,
            defaultValue: () => {
                return generateGiftCardCode();
            },
        },
        {
            name: "value",
            type: "number",
            label: "Initial value",
            required: true,
        },
        {
            name: "customer",
            type: "relationship",
            relationTo: "users",
            label: "Customer",
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "expiryDate",
            type: "date",
            label: "Expiration Date",
            admin: {
                description: "Date gift card will expire",
            },
        },
    ],
    endpoints: [
        {
            method: "get",
            path: "/verify",
            handler: async (req) => {
                try {
                    const ip = getClientIp(req);

                    if (!ip) {
                        return Response.json({
                            message: "Missing IP address.",
                            statusCode: 400,
                        });
                    }

                    await rateLimiter.consume(ip, 1);

                    const giftCards = await req.payload.find({
                        collection: "gift-cards",
                        where: {
                            code: {
                                equals: req.query.code,
                            },
                        },
                        limit: 1,
                    });

                    return Response.json(giftCards.docs?.[0]);
                } catch (reject) {
                    return Response.json({
                        message: "Too many requests. Please try again later.",
                        statusCode: 429,
                    });
                }
            },
        },
    ],
};
