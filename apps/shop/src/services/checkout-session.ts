"use client";

import { payloadSdk } from "@/utils/payload-sdk";
import { CheckoutSession } from "@shopnex/types";
import Cookies from "js-cookie";

export const updateCheckoutSession = async (data: Partial<CheckoutSession>) => {
    const sessionId = Cookies.get("checkout-session");

    if (!sessionId) {
        return;
    }

    const result = await payloadSdk.update({
        collection: "checkout-sessions",
        where: {
            sessionId: {
                equals: sessionId,
            },
        },
        data,
    });
    if (result.errors) {
        result.errors.forEach((error) => {
            console.error("Error updating checkout session:", error);
        });
    }
};
