import { AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";
import Link from "next/link";

import { Routes } from "@/store.routes";
import { Button } from "@/ui/shadcn/button";
import { getProductGallery } from "@/utils";
import {
  TypographyH5,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";
import type { Media, Product } from "@vyadove/types";

import InvertedCornerMask from "@/components/inverted-corner-mask";

export const ProductPreview = ({ product }: { product: Product }) => {
  const { originalPrice, price } = product.variants?.[0] || {};

  const thumbnailUrl = getProductGallery(product)[0]?.url;

  return (
    <VyaLink
      className="group/card flex flex-col rounded-xl p-0"
      href={`${Routes.productLink(product.handle as string)}`}
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
          <div className="relative flex size-[300px] h-[270px] w-full items-start">
            {thumbnailUrl && (
              <Image
                alt={"product image"}
                className="w-full rounded-xl object-cover object-top"
                fill
                src={thumbnailUrl}
              />
            )}
          </div>
        </InvertedCornerMask>
      </div>

      {/* -- PRODUCT META --- */}
      <div className="shadow-sm_ flex flex-1 flex-col gap-1 rounded-xl p-2 px-1">
        <TypographyH5
          className="line-clamp-1 font-semibold"
          title={product.title}
        >
          {product.title}
        </TypographyH5>

        <div className="itmes-center flex gap-2">
          {/*<FaInfoCircle className="mt-1" />*/}
          <TypographyMuted className="line-clamp-2 font-light">
            {product.description}
          </TypographyMuted>

          {/*<ItemDescription className="flex-1 text-wrap">
            {product.description}
          </ItemDescription> */}
        </div>

        {/* <div className="itmes-center flex hidden gap-2">
					<FaLocationDot className="mt-1" />
					<ItemDescription className="flex-1 text-wrap">{model.location}</ItemDescription>
				</div> */}

        <div className="my-auto flex items-center gap-4">
          <TypographyP className="text-[1rem]">
            ETB {price?.toLocaleString("en-US")}
          </TypographyP>
          {originalPrice && (
            <TypographyMuted className="text-muted-foreground/60 text-[1rem] font-normal line-through">
              ETB {originalPrice?.toLocaleString("en-US")}
            </TypographyMuted>
          )}
        </div>

        <Button className="bg-accent/60 mt-2 hidden self-start">
          Add to Cart
        </Button>
      </div>
    </VyaLink>
  );
};
