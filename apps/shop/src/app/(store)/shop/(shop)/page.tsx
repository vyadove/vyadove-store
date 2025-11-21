import React from "react";

import ShopScene from "@/scenes/shop";

async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{
    collectionId?: string;
    price?: string;
    category?: string;
    sortBy?: string;
  }>;
}) {
  return <ShopScene />;
}

export default ShopPage;
