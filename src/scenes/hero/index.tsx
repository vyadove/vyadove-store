import React from "react";
import { FiArrowRight, FiGift } from "react-icons/fi";

import {
  TypographyH1,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import VyaDoveLogo from "@/components/icons";
import InvertedCornerMask from "@/components/inverted-corner-mask";
import { Button } from "@ui/shadcn/button";

const links = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Services", href: "#" },
  { label: "Contact", href: "#" },
];

const Hero = () => {

  // background: linear-gradient(75.04deg, rgba(234, 226, 214, 0.8) 0%, rgba(234, 226, 214, 0.5) 52.07%, rgba(160, 186, 183, 0.21) 102.02%);
  // convert to tailwindcss
  // bg-[linear-gradient(75.04deg,rgba(234,226,214,0.8)0%,rgba(234,226,214,0.5)52.07%,rgba(160,186,183,0.21)102.02%)]

  return (
    <div className="">
      <InvertedCornerMask
        className="animate-gradient-xy flex w-full bg-linear-45 from-[rgba(243,224,214,1)] from-20%  to-[#2A4A3A]/30 bg-[length:140%_100%] "
        containerProps={{
          // className: 'w-full border-2'
        }}
        cornerContent={
          <div className="flex items-center justify-center gap-4 p-4 pt-3 pb-2">
            <VyaDoveLogo />

            <div className="flex">
              {links.map((link) => (
                <VyaLink
                  className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-3 text-sm font-medium transition-colors focus:outline-hidden"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </VyaLink>
              ))}
            </div>
          </div>
        }
        cornersRadius={15}
        invertedCorners={{
          tl: { inverted: true, corners: [15, 15, 15] },
        }}
      >
        <div className="flex h-full w-full flex-col gap-4 px-16 py-44 pb-40 ">
          <div className="flex w-max items-center gap-3 rounded-full border border-neutral-300/70 bg-neutral-200/80 p-1 pl-2">
            <TypographyMuted className="">
              Learn more about our gift choices
            </TypographyMuted>
            <VyaLink
              className="flex items-center gap-1 rounded-full border border-neutral-400 bg-neutral-100 px-4 py-1 font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
              href="#"
            >
              <TypographySmall>Gift Box</TypographySmall>
              <FiArrowRight  className="h-4 w-4" />
            </VyaLink>
          </div>

          <TypographyH1 className="leading-14">
            Gift Joy. Share Peace. <br /> Celebrate Life.
          </TypographyH1>

          <TypographyP className="max-w-2xl">
            Vyadove is Africa’s premier experience gifting platform. We help you
            connect with loved ones through unforgettable experiences — from spa
            days and fine dining to adventures and retreats — accessible across
            Africa and beyond.
          </TypographyP>

          <div className="mt-6 flex items-center gap-4">
            <Button size='lg'>
              Send a Gift
              <FiGift/>
            </Button>

            <Button size='lg' variant="outline">
              Send a Gift
              <FiArrowRight  className='-rotate-45' />
            </Button>
          </div>

        </div>
      </InvertedCornerMask>
    </div>
  );
};

export default Hero;


/* Rectangle 263 */

// position: absolute;
// width: 1372px;
// height: 681px;
// left: 0px;
// top: 0px;
//

// border-radius: 16px;
