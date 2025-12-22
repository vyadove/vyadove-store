import type { Checkout } from "@vyadove/types";
import { z } from "zod";

import { payloadSdk } from "@/utils/payload-sdk";

import type {
  CheckoutAddressUpdate,
  CheckoutItemInput,
  CheckoutLineItem,
} from "./types";

// Zod schemas for input validation
const CheckoutItemInputSchema = z.object({
  productId: z.number().int().positive().optional(),
  variantId: z.string().min(1, "Variant ID required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0).optional(),
  participants: z.number().int().min(1).max(100).optional(),
});

const VariantIdSchema = z.string().min(1, "Variant ID required");

const ShippingMethodIdSchema = z
  .number()
  .int()
  .positive("Invalid shipping method ID");

const PaymentMethodIdSchema = z
  .number()
  .int()
  .positive("Invalid payment method ID");

const AddressSchema = z
  .object({
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    streetAddress1: z.string().min(1).max(200).optional(),
    streetAddress2: z.string().max(200).optional(),
    city: z.string().min(1).max(100).optional(),
    postalCode: z.string().min(1).max(20).optional(),
    state: z.string().max(100).optional(),
    country: z.string().min(2).max(2).optional(), // ISO country code
    phone: z.string().max(30).optional(),
  })
  .optional();

const CheckoutAddressUpdateSchema = z.object({
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  email: z.string().email("Invalid email").optional(),
});

const GiftMessageSchema = z.object({
  enabled: z.boolean().optional(),
  recipientName: z.string().max(100).optional(),
  senderName: z.string().max(100).optional(),
  message: z.string().max(300).optional(),
});

const CheckoutFormUpdateSchema = z.object({
  paymentId: z.string().min(1, "Payment ID required"),
  shippingMethodString: z
    .string()
    .regex(/^\d+:\d+$/, "Invalid shipping method format")
    .optional()
    .or(z.literal("")),
  addresses: CheckoutAddressUpdateSchema,
  giftMessage: GiftMessageSchema.optional(),
});

// Inferred types from Zod schemas
type CheckoutItemInputZod = z.infer<typeof CheckoutItemInputSchema>;
type VariantId = z.infer<typeof VariantIdSchema>;
type ShippingMethodId = z.infer<typeof ShippingMethodIdSchema>;
type PaymentMethodId = z.infer<typeof PaymentMethodIdSchema>;
type CheckoutFormUpdate = z.infer<typeof CheckoutFormUpdateSchema>;

/**
 * Get current checkout session
 */
export async function getCheckoutAction(): Promise<Checkout | undefined> {
  try {
    const { docs } = await payloadSdk.find({
      collection: "checkout",
      depth: 2,
      where: {
        status: {
          not_equals: "complete",
        },
      },
      limit: 1,
      sort: "-createdAt",
    });

    if (!docs[0]) return undefined;

    return docs[0] as Checkout;
  } catch (error) {
    console.error("Error fetching checkout:", error);

    return undefined;
  }
}

/**
 * Create a new checkout session
 */
async function createCheckoutAction(
  item: CheckoutItemInput,
  currency: string = "USD",
): Promise<Checkout> {
  try {
    const participants = item.participants || 1;
    const totalPrice = item.unitPrice
      ? item.unitPrice * participants * item.quantity
      : 0;

    const checkout = await payloadSdk.create({
      collection: "checkout",
      data: {
        sessionId: `temp-${Date.now()}`,
        // Type assertion needed until Payload types are regenerated with participants field
        items: [
          {
            product: item.productId as number,
            variantId: item.variantId,
            quantity: item.quantity,
            participants,
            unitPrice: item.unitPrice,
            totalPrice,
          },
        ] as unknown as Checkout["items"],
        status: "incomplete",
        currency,
        subtotal: totalPrice,
        total: totalPrice,
      },
      depth: 2,
    });

    return checkout;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

/**
 * Helper to sanitize items for Payload (convert product objects to IDs)
 */
function sanitizeCheckoutItems(items: CheckoutLineItem[]): CheckoutLineItem[] {
  return items.map((item) => ({
    ...item,
    product: typeof item.product === "object" ? item.product.id : item.product,
  }));
}

/**
 * Add item to checkout
 */
export async function addToCheckoutAction(
  input: CheckoutItemInputZod,
  existingCheckout?: Checkout,
  currency: string = "USD",
): Promise<Checkout> {
  // Validate input
  const parsed = CheckoutItemInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }
  const validatedInput = parsed.data;

  try {
    if (!existingCheckout) {
      // Create new checkout with selected currency
      return await createCheckoutAction(
        validatedInput as CheckoutItemInput,
        currency,
      );
    }

    // Update existing checkout - add or increment quantity
    const existingItems = (existingCheckout.items || []) as CheckoutLineItem[];
    const existingItemIndex = existingItems.findIndex(
      (item) => item.variantId === validatedInput.variantId,
    );

    let updatedItems: CheckoutLineItem[];

    if (existingItemIndex >= 0) {
      // Update existing item - increment quantity, keep participants
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + validatedInput.quantity;
          const participants = (item as any).participants || 1;

          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice
              ? item.unitPrice * participants * newQuantity
              : 0,
          };
        }

        return item;
      });
    } else {
      // Add new item with participants
      const participants = validatedInput.participants || 1;

      updatedItems = [
        ...existingItems,
        {
          product: validatedInput.productId || 0,
          variantId: validatedInput.variantId,
          quantity: validatedInput.quantity,
          participants,
          unitPrice: validatedInput.unitPrice,
          totalPrice: validatedInput.unitPrice
            ? validatedInput.unitPrice * participants * validatedInput.quantity
            : 0,
        },
      ];
    }

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: sanitizeCheckoutItems(updatedItems),
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error adding to checkout:", error);
    throw error;
  }
}

/**
 * Update checkout item quantity
 */
export async function updateCheckoutItemAction(
  input: CheckoutItemInputZod,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  // Validate input
  const parsed = CheckoutItemInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.message}`);
  }
  const validatedInput = parsed.data;

  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const existingItems = (existingCheckout.items || []) as CheckoutLineItem[];

    // Update quantity or filter out if quantity is 0
    let updatedItems = existingItems.map((item) => {
      if (item.variantId === validatedInput.variantId) {
        const participants = (item as any).participants || 1;

        return {
          ...item,
          quantity: validatedInput.quantity,
          totalPrice: item.unitPrice
            ? item.unitPrice * participants * validatedInput.quantity
            : 0,
        };
      }

      return item;
    });

    // Filter out zero quantity items
    updatedItems = updatedItems.filter((item) => item.quantity > 0);

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: sanitizeCheckoutItems(updatedItems),
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout item:", error);
    throw error;
  }
}

/**
 * Remove item from checkout
 */
export async function removeFromCheckoutAction(
  variantId: VariantId,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  // Validate input
  const parsed = VariantIdSchema.safeParse(variantId);

  if (!parsed.success) {
    throw new Error(`Invalid variant ID: ${parsed.error.message}`);
  }
  const validatedVariantId = parsed.data;

  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const existingItems = (existingCheckout.items || []) as CheckoutLineItem[];
    const updatedItems = existingItems.filter(
      (item) => item.variantId !== validatedVariantId,
    );

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: sanitizeCheckoutItems(updatedItems),
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error removing from checkout:", error);
    throw error;
  }
}

/**
 * Clear all checkout items
 */
export async function clearCheckoutAction(
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        items: [],
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error clearing checkout:", error);
    throw error;
  }
}

/**
 * Update checkout address
 */
export async function updateCheckoutAddressAction(
  data: CheckoutAddressUpdate,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updateData: Partial<Checkout> = {};

    if (data.shippingAddress) updateData.shippingAddress = data.shippingAddress;
    if (data.billingAddress) updateData.billingAddress = data.billingAddress;
    if (data.email) updateData.email = data.email;

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: updateData,
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout address:", error);
    throw error;
  }
}

/**
 * Update checkout shipping method
 */
export async function updateCheckoutShippingAction(
  shippingMethodId: ShippingMethodId,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  // Validate input
  const parsed = ShippingMethodIdSchema.safeParse(shippingMethodId);

  if (!parsed.success) {
    throw new Error(`Invalid shipping method: ${parsed.error.message}`);
  }

  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        shippingMethod: parsed.data,
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout shipping:", error);
    throw error;
  }
}

/**
 * Update checkout payment method
 */
export async function updateCheckoutPaymentAction(
  paymentMethodId: PaymentMethodId,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  // Validate input
  const parsed = PaymentMethodIdSchema.safeParse(paymentMethodId);

  if (!parsed.success) {
    throw new Error(`Invalid payment method: ${parsed.error.message}`);
  }

  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        payment: parsed.data,
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout payment:", error);
    throw error;
  }
}

/**
 * Update checkout currency
 */
export async function updateCheckoutCurrencyAction(
  currency: string,
  existingCheckout?: Checkout,
): Promise<Checkout> {
  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        currency,
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout currency:", error);
    throw error;
  }
}

/**
 * Unified checkout form update - updates addresses, shipping, payment, and gift message in one call
 */
export async function updateCheckoutFormAction(
  paymentId: CheckoutFormUpdate["paymentId"],
  shippingMethodString: CheckoutFormUpdate["shippingMethodString"],
  addresses: CheckoutFormUpdate["addresses"],
  existingCheckout: Checkout,
  giftMessage?: CheckoutFormUpdate["giftMessage"],
): Promise<Checkout> {
  // Validate inputs
  const parsed = CheckoutFormUpdateSchema.safeParse({
    paymentId,
    shippingMethodString,
    addresses,
    giftMessage,
  });

  if (!parsed.success) {
    console.error("error message : ", parsed.error.message);
    throw new Error(`Invalid form data`);
  }
  const validated = parsed.data;

  try {
    if (!existingCheckout) throw new Error("Checkout not found");

    // Parse shippingMethodString to extract shippingId (optional for eVoucher orders)
    const shippingId = validated.shippingMethodString
      ? validated.shippingMethodString.split(":")[0]
      : null;

    // Update checkout with all form data - use paymentId directly
    const updatedCheckout = await payloadSdk.update({
      collection: "checkout",
      id: existingCheckout.id,
      data: {
        shippingAddress: validated.addresses.shippingAddress,
        billingAddress: validated.addresses.billingAddress,
        email: validated.addresses.email,
        ...(shippingId && { shippingMethod: Number(shippingId) }),
        payment: Number(validated.paymentId),
        ...(validated.giftMessage && { giftMessage: validated.giftMessage }),
      },
      depth: 2,
    });

    return updatedCheckout;
  } catch (error) {
    console.error("Error updating checkout form:", error);
    throw error;
  }
}
