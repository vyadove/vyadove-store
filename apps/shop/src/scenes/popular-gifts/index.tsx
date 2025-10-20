import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@shopnex/types";
import { Button } from "@ui/shadcn/button";
import {
  TypographyH1, TypographyH3, TypographyH6, TypographyMuted, TypographyP,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import InvertedCornerMask from "@/components/inverted-corner-mask";
import { ItemDescription } from "@/components/ui/item";

import { getVariantImage } from "@/utils/get-variant-image";
import { payloadSdk } from "@/utils/payload-sdk";

export async function PopularGifts() {
  const featuredCollections = await payloadSdk.find({
    collection: "collections",
    limit: 1,
    where: {
      handle: {
        equals: "popular",
      },
    },
  });

  const products = await payloadSdk.find({
    collection: "products",
    // limit: 3,
    sort: "createdAt",
    where: {
      collections: {
        equals: featuredCollections?.docs[0]?.id,
      },
    },
  });

  return (
    <div className="mt-24 flex flex-col gap-8">
      <div className="flex items-center justify-between gap-8">
        <div>
          <TypographyH1 className="lg:text-4xl">
            Most Popular Gifts
          </TypographyH1>

          <TypographyP className="text-muted-foreground max-w-xl">
            Our top used lists
          </TypographyP>
        </div>

        <Button asChild className="border-none" size="lg" variant="outline">
          <VyaLink href="/">
            View All
            <AiOutlineArrowRight className="" />
          </VyaLink>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.docs.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const ProductPreview = ({
  isFeatured,
  product,
}: {
  isFeatured?: boolean;
  product: Product;
}) => {
  const { originalPrice, price } = product.variants?.[0] || {};
  const variantWithImage = product.variants?.find((v) => {
    return getVariantImage(v);
  });
  const thumbnail = getVariantImage(variantWithImage as Product["variants"][0]);

  return (
    <Link
      className="group/card flex flex-col rounded-xl p-0 "
      href={`/products/${product.handle}`}
    >
      <div className="">
        {/* --- THUMBNAIL --- */}
        <InvertedCornerMask
          className="w-full bg-[#2A4A3A]/10"
          cornerContent={
            <div className="flex items-center justify-center gap-2 p-2">
              <Button
                className="bg-accent/40 text-black group-hover/card:-rotate-45 "
                size="icon-lg"
              >
                <AiOutlineArrowRight className="" />
              </Button>
            </div>
          }
          cornersRadius={15}
          invertedCorners={{
            br: { inverted: true, corners: [15, 15, 15] },
          }}
        >
          <div className="">
            {thumbnail && (
              <Image
                alt={"model.name"}
                className="w-full rounded-xl object-cover"
                height={128}
                src={thumbnail}
                width={128}
              />
            )}
          </div>
        </InvertedCornerMask>
      </div>

      <div className="flex flex-1 flex-col gap-2 rounded-xl p-4 shadow-sm">
        <TypographyH3 className="line-clamp-1" title={product.title}>{product.title}</TypographyH3>

        <div className="itmes-center mt-auto flex gap-2">
          {/*<FaInfoCircle className="mt-1" />*/}
          <TypographyP className='font-light'>{product.description}</TypographyP>

           {/*<ItemDescription className="flex-1 text-wrap">
            {product.description}
          </ItemDescription> */}
        </div>

        {/* <div className="itmes-center flex hidden gap-2">
					<FaLocationDot className="mt-1" />
					<ItemDescription className="flex-1 text-wrap">{model.location}</ItemDescription>
				</div> */}

        <div className="mt-auto flex items-center gap-4">
          <TypographyH6 className="text-muted-foreground mt-auto">
            ETB {price?.toLocaleString("en-US")}
          </TypographyH6>
          {originalPrice && (
            <TypographyH6 className="text-muted-foreground/60 font-normal line-through">
              ETB {originalPrice?.toLocaleString("en-US")}
            </TypographyH6>
          )}
        </div>

        <Button className="bg-accent/60 mt-2 self-start">Add to Cart</Button>
      </div>
    </Link>
  );
};
