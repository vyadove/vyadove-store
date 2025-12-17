import type { Checkout, Media, Product } from "@vyadove/types";

/**
 * Address structure for shipping and billing
 */
export interface CheckoutAddress {
  firstName?: string;
  lastName?: string;
  company?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  phone?: string;
}

/**
 * Product variant from the Product type
 */
/*export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  sku?: string;
  inventory?: number;
  options?: Array<{
    name: string;
    value: string;
  }>;
}*/

type StoreProduct = Omit<Product, "gallery"> & {
  gallery?: Media[];
};

/*{
  product: number | Product;
  variantId: string;
  quantity: number;
  /!**
   * Price per unit at time of adding to checkout
   *!/
  unitPrice?: number | null;
  /!**
   * Unit price × quantity
   *!/
  totalPrice?: number | null;
  id?: string | null;
}*/

/**
 * Checkout line item (product in cart/checkout)
 */

type NonNullableCheckoutItems = NonNullable<Checkout["items"]>[number];

export interface CheckoutLineItem {
  variantId: string;
  product: Product | number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  isLoading?: boolean; // Indicates if this item is currently syncing with backend
}

/**
 * Extended checkout item with enriched product data
 */
// export interface EnrichedCheckoutItem extends CheckoutLineItem {
export interface EnrichedCheckoutItem
  extends Omit<CheckoutLineItem, "product"> {
  product: StoreProduct; // Always populated product object (not ID)
  variant?: Product["variants"][number];
}

/**
 * Input for adding/updating checkout items
 */
export interface CheckoutItemInput {
  variantId: string;
  quantity: number;
  productId?: number;
  unitPrice?: number;
}

/**
 * Address update data
 */
export interface CheckoutAddressUpdate {
  shippingAddress?: Checkout["shippingAddress"];
  billingAddress?: Checkout["billingAddress"];
  email?: string;
}
