export const Routes = {
  home: "/",
  privacyPolicy: "/privacy-policy",
  support: "/support",
  login: "/login",
  signUp: "/sign-up",
  account: "/account",
  checkout: "/checkout",
  checkoutReview: "/checkout/review",
  /** @deprecated Use checkout instead */
  cart: "/checkout",
  shop: "/shop",
  orderTrack: "/order/track",
  orderTrackById: (orderId: string) => `/order/track/${orderId}`,
  productLink: (handle: string) => `/product/${handle}`,
  categoryLink: (slug: string) => `/category/${slug}`,
  collectionLink: (handle: string) => `/collection/${handle}`,
  termsAndConditions: "/terms-and-conditions",
};
