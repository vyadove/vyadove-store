import { payloadSdk } from "@/utils/payload-sdk";
import { Cart } from "@shopnex/types";
import Cookies from "js-cookie";

export const setAddresses = (cartId: string, addresses: any) => {
    return null;
};

const emptyCart: Cart = {
    cartItems: [],
    completed: false,
    id: 0,
    sessionId: "",
    updatedAt: "",
    createdAt: "",
};

export const getCart = async () => {
    const sessionId = Cookies.get("cart-session");

    if (!sessionId) {
        return null;
    }

    const result = await payloadSdk.find({
        collection: "carts",
        where: {
            sessionId: {
                equals: sessionId,
            },
        },
    });

    return result.docs[0] || emptyCart;
};

export const initiatePaymentSession = (cartId: string, data: any) => {
    return {};
};

export const placeOrder = (cartId: string, data: any) => {
    return {};
};

export const setShippingMethod = ({ cartId, shippingMethodId }: any) => {
    return {};
};

export async function createCart(item: {
    id: string;
    productId: number;
    quantity: number;
}): Promise<Cart> {
    const cart = await payloadSdk.create({
        collection: "carts",
        data: {
            cartItems: [
                {
                    product: item.productId,
                    quantity: item.quantity,
                    variantId: item.id,
                },
            ],
        },
    });

    return cart;
}

export async function updateCart(item: {
    id: string;
    productId: number;
    quantity: number;
}) {
    const cart = await getCart();

    if (!cart) {
        throw new Error("No cart found");
    }

    const existingItems = cart?.cartItems || [];
    const existingItemIndex = existingItems.findIndex(
        (cartItem: any) => cartItem.variantId === item.id
    );

    let updatedCartItems;

    if (item.quantity === 0) {
        updatedCartItems = existingItems.filter(
            (cartItem: any) => cartItem.variantId !== item.id
        );
    } else if (existingItemIndex > -1) {
        updatedCartItems = existingItems.map((cartItem: any, index: number) => {
            if (index === existingItemIndex) {
                return {
                    ...cartItem,
                    quantity: item.quantity,
                };
            }
            return cartItem;
        });
    } else {
        updatedCartItems = [
            ...existingItems,
            {
                product: item.productId,
                quantity: item.quantity,
                variantId: item.id,
            },
        ];
    }

    await payloadSdk.update({
        id: cart.id,
        collection: "carts",
        data: {
            cartItems: updatedCartItems,
        },
    });
}

export async function syncCartWithBackend(
    item: {
        id: string;
        product: number;
        variantId: string;
        quantity: number;
        action?: "update";
    },
    sessionId: string
) {
    if (sessionId) {
        await fetch(`/api/carts/session/${sessionId}`, {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify({
                item,
                action: item.action,
            }),
        });
    } else {
        await fetch("/api/carts/session", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                item,
                action: item.action,
            }),
        });
    }
}
