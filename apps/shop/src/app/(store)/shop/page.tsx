import React from "react";

import { EmptyOutline } from "@/app/(store)/shop/empty-collections";

import { ProductPreview } from "@/components/products/product-card";

import { payloadSdk } from "@/utils/payload-sdk";

// import { payloadSdk } from "@/utils/payload-sdk";
// import { ProductPreview } from "@/components/products/product-card";

export const dynamic = "force-dynamic"; // disables static gen

async function ShopPage({ searchParams }: any) {
  const collectionId = searchParams?.collectionId || "all";

  const products = await payloadSdk.find(
    {
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
    },
    {
      cache: "no-cache",
    },
  );

  console.log("products  --", products, searchParams.collectionId);

  if (products?.docs?.length === 0) {
    return (
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <EmptyOutline />
      </div>
    );
  }

  return (
    <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products?.docs?.map((product) => (
        <ProductPreview key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ShopPage;
