import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";

import { Button } from "@ui/shadcn/button";
import { TypographyH1, TypographyH3, TypographyP } from "@ui/shadcn/typography";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import ProductImg2 from "./img_1.png";
import ProductImg3 from "./img_2.png";
import ProductImg4 from "./img_3.png";
import ProductImg5 from "./img_4.png";

const models = [
  {
    name: "Wellness & Spa",
    description:
      "1 or 2 comfortable nights in a B&B or hotel with a delicious breakfast for 2 people",
    location:
      "74 comfortable accommodations throughout Addis Abeba to choose from",
    image: ProductImg5,
    price: 400,
  },
  {
    name: "Food & Dining",
    description:
      "A luxurious 3-course dinner for 2 people, enjoy local or international flavors",
    location:
      "Taste surprising flavors at 121 top restaurants in your own country",
    image: ProductImg2,
    price: 1200,
  },
  {
    name: "Adventure & Tours",
    description:
      "Explore a new city and stay 1 night in a hotel with breakfast for 2 people",
    location: "Choose from 83 charming accommodations throughout Belgium",
    image: ProductImg3,
    price: 5000,
  },
  {
    name: "Stays & Escapes",
    description:
      "Overnight stay in a cozy hotel in Belgium, perfect for completely relaxing together this Christmas",
    location: "83 locations to enjoy in your own country",
    image: ProductImg4,
    price: 10000,
  },
  {
    name: "Wellness & Spa",
    description:
      "1 or 2 comfortable nights in a B&B or hotel with a delicious breakfast for 2 people",
    location:
      "74 comfortable accommodations throughout Addis Abeba to choose from",
    image: ProductImg5,
    price: 400,
  },
  {
    name: "Food & Dining",
    description:
      "A luxurious 3-course dinner for 2 people, enjoy local or international flavors",
    location:
      "Taste surprising flavors at 121 top restaurants in your own country",
    image: ProductImg2,
    price: 1200,
  },
];

export function Collections() {
  return (
    <div className="mt-24 flex flex-col gap-8">
      <div>
        <TypographyH1 className="lg:text-4xl">Our Collections</TypographyH1>
        <TypographyP className="text-muted-foreground max-w-xl">
          Explore our diverse range of categories to find the perfect experience
          that suits your interests and desires.
        </TypographyP>
      </div>

      <div className="grid grid-cols-3 gap-12">
        {models.map((model) => (
          <div className="flex flex-col rounded-xl p-0" key={model.name}>
            <InvertedCornerMask
              className="w-full bg-[#2A4A3A]/10"
              cornerContent={
                <div className="flex items-center justify-center gap-2 p-4">
                  <Button className="bg-[#2A4A3A]/30 text-black" size="icon-lg">
                    <AiOutlineArrowRight />
                  </Button>
                </div>
              }
              cornersRadius={20}
              invertedCorners={{
                br: { inverted: true, corners: [20, 20, 20] },
              }}
            >
              <div className="">
                <Image
                  alt={model.name}
                  className="w-full"
                  // height={128}
                  src={model.image}
                  // width={128}
                />
              </div>
            </InvertedCornerMask>

            <div className="flex flex-1 flex-col gap-4 p-4">
              <TypographyH3 className="line-clamp-2">{model.name}</TypographyH3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
