import React from "react";
import { FiGift } from "react-icons/fi";

import { Routes } from "@/store.routes";
import AppHeroScaffold from "@ui/nav/app-hero-scaffold";
import { Button } from "@ui/shadcn/button";
import { TypographyH1, TypographyLead } from "@ui/shadcn/typography";
import { VyaLink } from "@ui/vya-link";

import { SearchInput } from "./search-input";

const Hero = () => {
  // background: linear-gradient(75.04deg, rgba(234, 226, 214, 0.8) 0%, rgba(234, 226, 214, 0.5) 52.07%, rgba(160, 186, 183, 0.21) 102.02%);
  // convert to tailwindcss
  // bg-[linear-gradient(75.04deg,rgba(234,226,214,0.8)0%,rgba(234,226,214,0.5)52.07%,rgba(160,186,183,0.21)102.02%)]

  return (
    <AppHeroScaffold>
      <div className="relative flex h-full w-full flex-col gap-4 px-8 py-36 pb-20 lg:px-16 lg:py-44 ">
        <div className="">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-10"
            // style="filter: hue-rotate(120deg) saturate(1.2);"
            src="/hero-vid.mp4"
          />

          <div className="pointer-events-none absolute inset-0 -z-10 bg-green-50/65 mix-blend-hue" />
        </div>

        <SearchInput />

        <TypographyH1 className="md:leading-14">
          Gift Joy, Share Peace, <br className="hidden sm:block" /> Celebrate
          Life - <span className="text-accent-500 text-shadow-lg">Vyadove</span>
        </TypographyH1>

        <TypographyLead className="text-foreground max-w-2xl text-lg font-normal">
          Vyadove is Africa&#39;s premier experience gifting platform. We help
          you connect with loved ones through unforgettable experiences — from
          spa days and fine dining to adventures and retreats.
        </TypographyLead>

        <div className=" flex items-center gap-4">
          <VyaLink href={Routes.shop}>
            <Button className="cursor-pointer" size="xl">
              Send a Gift
              <FiGift />
            </Button>
          </VyaLink>
        </div>
      </div>
    </AppHeroScaffold>
  );
};

export default Hero;
