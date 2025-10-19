import React from "react";
import { FiArrowRight, FiGift, FiSearch, FiShoppingCart } from "react-icons/fi";

import NavBar from "@/scenes/hero/nav-bar";
import { Button } from "@ui/shadcn/button";
import { Separator } from "@ui/shadcn/separator";
import {
  TypographyH1,
  TypographyLead,
  TypographyMuted,
  TypographySmall,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import VyaDoveLogo from "@/components/icons";
import CartIcon from "@/components/icons/cart-icon";
import InvertedCornerMask from "@/components/inverted-corner-mask";

const Hero = () => {
  // background: linear-gradient(75.04deg, rgba(234, 226, 214, 0.8) 0%, rgba(234, 226, 214, 0.5) 52.07%, rgba(160, 186, 183, 0.21) 102.02%);
  // convert to tailwindcss
  // bg-[linear-gradient(75.04deg,rgba(234,226,214,0.8)0%,rgba(234,226,214,0.5)52.07%,rgba(160,186,183,0.21)102.02%)]

  return (
    <div className="">
      <InvertedCornerMask
        className="animate-gradient-xy flex w-full bg-linear-45 from-[rgba(243,224,214,1)] from-20%  to-[#2A4A3A]/30 bg-[length:140%_100%] "
        containerProps={
          {
            // className: 'w-full border-2'
          }
        }
        cornerContent={
          <div className="flex items-center justify-center gap-6 p-4 pt-2 pb-2">
            <VyaDoveLogo />

            <NavBar />

            <div className="hidden lg:flex">
              <Separator className="h-full" orientation="vertical" />

              <div className="flex items-center">
                <Button size="icon" variant="link">
                  <FiSearch stroke="#000" strokeWidth={2} />
                </Button>

                <Button size="icon" variant="link">
                  <CartIcon />
                </Button>
              </div>
            </div>
          </div>
        }
        cornersRadius={25}
        invertedCorners={{
          tl: { inverted: true, corners: [25, 25, 25] },
        }}
      >
        <div className="flex h-full w-full flex-col gap-4 px-8 py-36 pb-20 lg:px-16 lg:py-44 ">
          <div>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover -z-10"
              // style="filter: hue-rotate(120deg) saturate(1.2);"
              src="/hero-vid.mp4"
            />

            <div className="absolute inset-0 bg-green-50/65 mix-blend-hue" />
          </div>

          <div className="flex w-max items-center gap-3 rounded-full border border-neutral-300/70 bg-neutral-200/80 p-1 pl-2">
            <TypographyMuted className="">
              Learn more about our gift choices
            </TypographyMuted>
            <VyaLink
              className="flex items-center gap-1 rounded-full border border-neutral-400 bg-neutral-100 px-4 py-1 font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
              href="#"
            >
              <TypographySmall>Gift Box</TypographySmall>
              <FiArrowRight className="h-4 w-4" />
            </VyaLink>
          </div>

          <TypographyH1 className="md:leading-14">
            Gift Joy, Share Peace, <br className="hidden sm:block" /> Celebrate
            Life - <span className="text-accent">Vyadove</span>
          </TypographyH1>

          <TypographyLead className="text-foreground max-w-2xl text-lg font-normal">
            Vyadove is Africa’s premier experience gifting platform. We help you
            connect with loved ones through unforgettable experiences — from spa
            days and fine dining to adventures and retreats.
          </TypographyLead>

          <div className=" flex items-center gap-4">
            <Button size="lg">
              Send a Gift
              <FiGift />
            </Button>
          </div>
        </div>
      </InvertedCornerMask>
    </div>
  );
};

export default Hero;
