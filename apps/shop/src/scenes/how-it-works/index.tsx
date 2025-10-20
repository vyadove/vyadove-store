import React from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaGift } from "react-icons/fa";
import { PiConfettiBold } from "react-icons/pi";

import {
  TypographyH1,
  TypographyH3,
  TypographyMuted,
  TypographyP,
} from "@ui/shadcn/typography";

import InvertedCornerMask from "@/components/inverted-corner-mask";

const steps = [
  {
    title: "Choose an Experience",
    description:
      "Browse curated experiences from wellness and dining to adventures and escapes.",
    icon: BiSolidCategoryAlt,
  },
  {
    title: "Send a Gift Voucher",
    description:
      "Browse curated experiences from wellness and dining to adventures and escapes.",
    icon: FaGift,
  },
  {
    title: "Celebrate Together",
    description:
      "Your loved one redeems the experience at partnered locations in Ethiopia (and soon across Africa).",
    icon: PiConfettiBold,
  },
];

const HowItWorks = () => {
  return (
    <div className="mt-24 flex flex-col gap-8">
      <div>
        <TypographyH1 className="lg:text-4xl">How It Works</TypographyH1>

        <TypographyP className="text-muted-foreground max-w-xl">
          Explore our diverse range of categories to find the perfect experience
          that suits your interests and desires.
        </TypographyP>
      </div>

      <div className="grid w-full gap-8 sm:grid-cols-2 md:grid-cols-3">
        {steps.map((step, index) => (
          <InvertedCornerMask
            className="bg-accent-foreground  h-full"
            cornerContent={
              <div className="p-2 sm:p-3">
                <div className="bg-accent/20 flex items-center justify-center gap-4 rounded-full p-3 sm:p-4">
                  <step.icon className="text-xl sm:text-2xl" />
                </div>
              </div>
            }
            cornersRadius={20}
            invertedCorners={{
              tl: { inverted: true, corners: [20, 20, 20] },
            }}
            key={index}
          >
            <div className="flex flex-col items-start gap-2 px-10 pt-22 pb-10 sm:pt-32 sm:pb-10">
              <TypographyH3 className="text-accent font-bold">{step.title}</TypographyH3>

              <TypographyP className='font-light'>{step.description}</TypographyP>
            </div>
          </InvertedCornerMask>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
