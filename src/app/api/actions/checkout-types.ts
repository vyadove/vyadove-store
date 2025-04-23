import type { User } from "@/payload-types";

export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    gallery: Array<{ url: string }>;
    options: Array<{ option: string; value: string }>;
    selectedVariant: {
        id: string;
        price: number;
    };
}

export interface CheckoutResult {
    url?: string;
    error?: string;
    sessionId?: string;
}

export type PaymentStatus = "pending" | "completed" | "cancelled" | "failed";

export interface CreateOrderData {
    orderNumber: string;
    items: Array<{
        product: number;
        quantity: number;
        variant: string;
    }>;
    total: number;
    user: User | null;
    status: PaymentStatus;
}

export interface UpdateOrderStatusData {
    sessionId: string;
    status: PaymentStatus;
}
