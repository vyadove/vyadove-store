import { AiOutlineArrowRight } from "react-icons/ai";

import Link from "next/link";

import { Button } from "@/ui/shadcn/button";
import type { Product } from "@shopnex/types";
import { TypographyH3, TypographyMuted } from "@ui/shadcn/typography";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { getVariantImage } from "@/utils/get-variant-image";
import Image from "next/image";

export const ProductPreview = ({
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
  const thumbnailUrl = thumbnail ? thumbnail : variantWithImage?.imageUrl;

  return (
    <Link
      className="group/card flex flex-col rounded-xl p-0 "
      // href={`/products/${product.handle}`}
      href={`/`}
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
          <div className="relative flex size-[300px] w-full items-start">
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
        <TypographyH3 className="line-clamp-1" title={product.title}>
          {product.title}
        </TypographyH3>

        <div className="itmes-center flex gap-2">
          {/*<FaInfoCircle className="mt-1" />*/}
          <TypographyMuted className="font-light">
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

        <div className="flex items-center gap-4 ">
          <TypographyMuted className="text-muted-foreground text-[1rem]">
            ETB {price?.toLocaleString("en-US")}
          </TypographyMuted>
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
    </Link>
  );
};
