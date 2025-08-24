"use client";

import { CheckoutSession } from "@shopnex/types";
import Cookies from "js-cookie";

export const updateCheckoutSession = async (data: Partial<CheckoutSession>) => {
    const sessionId = Cookies.get("checkout-session");

    if (!sessionId) {
        return;
    }

    const result = await fetch(`/api/checkout-sessions/session/${sessionId}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (result.ok) {
        const session = await result.json();
        return session.checkoutSession;
    }
};

export const createCheckoutSession = async (data: Partial<CheckoutSession>) => {
    const result = await fetch("/api/checkout-sessions/session", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
    });

    if (result.ok) {
        const session = await result.json();
        return session.checkoutSession;
    }
};
