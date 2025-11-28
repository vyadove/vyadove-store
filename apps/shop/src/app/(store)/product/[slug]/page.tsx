import React from "react";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ProductDetail from "@/scenes/product-detail";

import { payloadSdk } from "@/utils/payload-sdk";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: ProductPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;

  const result = await payloadSdk.find({
    collection: "products",
    limit: 1,
    where: {
      handle: {
        equals: slug,
      },
    },
    select: {
      title: true,
      meta: {
        title: true,
        description: true,
      },
    },
  });

  if (!result.docs.length) {
    notFound();
  }

  const [product] = result.docs;

  if (!product) {
    notFound();
  }

  return {
    description: product.meta?.title || `${product.title}`, // Fallback to title if no meta description
    openGraph: {
      title: product.meta?.title || `${product.title} | Vyadove`, // Fallback if no meta title
      description: product.meta?.description || `${product.title}`,
      // images: product.thumbnail ? [product.thumbnail] : [],
    },
    title: product.meta?.title || `${product.title} | Vyadove`,
  };
}

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;


  const product = await payloadSdk.find({
    collection: "products",
    limit: 1,
    where: {
      handle: {
        equals: slug,
      },
    },
  });


  const featuredCollections = await payloadSdk.find({
    collection: "collections",
    limit: 1,
    where: {
      handle: {
        equals: "popular",
      },
    },
  });

  const relatedGifts = await payloadSdk.find({
    collection: "products",
    // limit: 3,
    sort: "createdAt",
    where: {
      collections: {
        equals: featuredCollections?.docs[0]?.id,
      },
    },
  });

  const [targetProduct] = product.docs;

  if (!targetProduct) {
    notFound();
  }

  return (
    <ProductDetail product={targetProduct} relatedGifts={relatedGifts.docs} />
  );
}
