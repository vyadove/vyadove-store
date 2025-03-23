import type { Plugin } from "payload";
import { stripePlugin } from "@payloadcms/plugin-stripe";
import { paymentSucceeded } from "./stripe/webhooks/payment-succeeded";
import { paymentCanceled } from "./stripe/webhooks/payment-canceled";
import { cjPlugin } from "@shoplyjs/cj-plugin";
import { storePlugin } from "@shopnex/store-plugin";

export const plugins: Plugin[] = [
    stripePlugin({
        isTestKey: Boolean(process.env.NEXT_PUBLIC_STRIPE_IS_TEST_KEY),
        logs: true,
        rest: false,
        stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
        stripeWebhooksEndpointSecret:
            process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
        webhooks: {
            "payment_intent.succeeded": paymentSucceeded,
            "payment_intent.canceled": paymentCanceled,
        },
    }),
    cjPlugin({
        cjEmailAddress: process.env.CJ_EMAIL_ADDRESS || "",
        cjRefreshToken: process.env.CJ_REFRESH_TOKEN,
        cjApiKey: process.env.CJ_PASSWORD || "",
    }),
    storePlugin({}),
];
