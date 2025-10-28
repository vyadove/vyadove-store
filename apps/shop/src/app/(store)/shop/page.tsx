import React from "react";

import { EmptyOutline } from "@/app/(store)/shop/empty-collections";

import { ProductPreview } from "@/components/products/product-card";

import { payloadSdk } from "@/utils/payload-sdk";

// import { payloadSdk } from "@/utils/payload-sdk";
// import { ProductPreview } from "@/components/products/product-card";

interface PageProps {
  searchParams: {
    collectionId?: string; // This will hold the ID you set in the URL
  };
}

async function ShopPage({ searchParams }: PageProps) {
  const selectedCollectionId = searchParams?.collectionId || "all";

  const products = await payloadSdk.find(
    {
      collection: "products",
      // limit: 3,
      sort: "createdAt",
      where: {
        ...(selectedCollectionId === "all"
          ? {
              collections: {
                equals: selectedCollectionId || undefined,
              },
            }
          : {}),
      },
    }
  );

  console.log("products  --", products, selectedCollectionId);

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
