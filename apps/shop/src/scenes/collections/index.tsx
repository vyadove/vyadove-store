import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";

import { TypographyH1, TypographyH3, TypographyP } from "@ui/shadcn/typography";
import type { Media } from "@vyadove/types";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { payloadSdk } from "@/utils/payload-sdk";

export async function Collections() {
  const collections = await payloadSdk.find({
    collection: "collections",
    limit: 6,

    where: {
      visible: {
        equals: true,
      },

      handle: {
        not_equals: "popular",
      },
    },
  });

  return (
    <div className="mt-24 flex flex-col gap-8">
      <div>
        <TypographyH1 className="lg:text-4xl">Our Collections</TypographyH1>
        <TypographyP className="text-muted-foreground max-w-xl">
          Explore our diverse range of categories to find the perfect experience
          that suits your interests and desires.
        </TypographyP>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
        {collections.docs.map((collection) => (
          <div
            className="group flex flex-col rounded-xl p-0"
            key={collection.id}
          >
            <InvertedCornerMask
              className="w-full rounded-2xl"
              cornerContent={
                <div className="bg-accent/20 group/hover:hidden m-3 flex items-center justify-center gap-2 rounded-full p-4">
                  <AiOutlineArrowRight size={20} />
                </div>
              }
              cornersRadius={20}
              invertedCorners={{
                br: { inverted: true, corners: [20, 20, 20] },
              }}
            >
              <div className="relative min-h-60 w-full sm:min-h-72">
                {(collection.imageUrl ||
                  (collection.thumbnail as any)?.url) && (
                  <Image
                    alt={(collection?.thumbnail as Media)?.alt || "-"}
                    className="w-full object-cover"
                    fill
                    src={
                      (collection?.thumbnail as any)?.url ||
                      collection?.imageUrl
                    }
                  />
                )}
              </div>
            </InvertedCornerMask>

            <div className="flex flex-1 flex-col gap-4 p-4">
              <TypographyH3 className="line-clamp-2">
                {collection.title}
              </TypographyH3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
