import React from "react";

import { EmptyOutline } from "@/app/(store)/shop/components/empty-collections";

import { ProductPreview } from "@/components/products/product-card";

import { payloadSdk } from "@/utils/payload-sdk";

// import { payloadSdk } from "@/utils/payload-sdk";
// import { ProductPreview } from "@/components/products/product-card";

export const dynamic = "force-dynamic"; // disables static gen

async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ collectionId?: string }>;
}) {
  const collectionId = (await searchParams)?.collectionId || "all";

  const products = await payloadSdk.find({
    collection: "products",
    // limit: 3,
    sort: "createdAt",
    where: {
      ...(collectionId === "all" || !collectionId
        ? {
            collections: {
              equals: undefined,
            },
          }
        : {
            collections: {
              equals: collectionId,
            },
          }),
    },
  });

  if (products?.docs?.length === 0) {
    return (
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <EmptyOutline />
      </div>
    );
  }

  return (
    <div className="mt-12 grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products?.docs?.map((product) => (
        <ProductPreview key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ShopPage;
