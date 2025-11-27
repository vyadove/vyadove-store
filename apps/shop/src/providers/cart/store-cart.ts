import type { Cart, Media, Product } from "../../../../../packages/types";

export type StoreProduct = Omit<Product, "gallery"> & {
  gallery?: Media[];
};

export type StoreCartItem = Omit<
  NonNullable<Cart["cartItems"]>[number],
  "product"
> & {
  product: StoreProduct;
  price: number; // The price of the specific variant
  variant?: StoreProduct["variants"][number]; // The specific variant for this cart item
};

export interface Metadata {
  [key: string]: any;
}

export type StoreCart = Omit<Cart, "cartItems"> & {
  cartItems?: StoreCartItem[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartTotal: number;
  metadata: Metadata;
};
