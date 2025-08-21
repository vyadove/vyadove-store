import type { StripeWebhookHandler } from "@shopnex/stripe-plugin/types";
import type { Payload } from "payload";
import type Stripe from "stripe";

export interface PaymentWebhookEvent {
    data: {
        object: Stripe.PaymentIntent;
    };
    id: string;
}

export type WebhookLogger = Payload["logger"];

export interface PaymentMetadata {
    orderId?: string;
    email?: string;
}

export interface BillingDetails {
    name?: string;
    address?: Stripe.Address;
    email?: string;
    phone?: string;
}

export interface ShippingDetails {
    name?: string;
    address?: Stripe.Address;
    phone?: string;
}

export type PaymentSucceededHandler = StripeWebhookHandler<PaymentWebhookEvent>;
export type PaymentCanceledHandler = StripeWebhookHandler<PaymentWebhookEvent>;