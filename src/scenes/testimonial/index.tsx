import React from "react";
import Marquee from "react-fast-marquee";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import {
  FiDatabase,
  FiLayers,
  FiMessageSquare,
  FiTarget,
} from "react-icons/fi";

import Image from "next/image";

import { Button } from "@ui/shadcn/button";
import {
  TypographyH1,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
} from "@ui/shadcn/typography";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import Person from "./img.png";

type LogoItem = {
  name: string;
  icon: React.ReactElement;
};

const clientLogos: LogoItem[] = [
  { name: "Sisyphus", icon: <FiLayers className="h-5 w-5" /> },
  { name: "Circooles", icon: <FiTarget className="h-5 w-5" /> },
  { name: "Catalog", icon: <FiDatabase className="h-5 w-5" /> },
  { name: "Quotient", icon: <FiMessageSquare className="h-5 w-5" /> },
  { name: "Sisyphus", icon: <FiLayers className="h-5 w-5" /> },
  { name: "Circooles", icon: <FiTarget className="h-5 w-5" /> },
  { name: "Catalog", icon: <FiDatabase className="h-5 w-5" /> },
  { name: "Quotient", icon: <FiMessageSquare className="h-5 w-5" /> },
];

const Testimonial = () => {
  return (
    <InvertedCornerMask
      className="mt-24 w-full bg-[#2A4A3A]/10"
      cornerContent={
        <div className="flex items-center justify-center gap-2 p-6">
          <Button className="bg-[#2A4A3A]/30 text-black" size="icon-lg">
            <AiOutlineArrowLeft className="" size={222} />
          </Button>

          <Button className="bg-[#2A4A3A]/30 text-black" size="icon-lg">
            <AiOutlineArrowRight />
          </Button>
        </div>
      }
      cornersRadius={15}
      invertedCorners={{
        tr: { inverted: true, corners: [20, 20, 20] },
      }}
    >
      <div className="flex h-full w-full flex-col gap-4 p-24">
        <section className="mx-auto flex max-w-6xl flex-col items-center text-center">
          {/* Avatar + Person */}
          <div className="flex flex-col items-center">
            <div className="size-24 overflow-hidden rounded-full shadow ring-2 ring-white">
              <Image
                alt="Aster Awoke"
                className="h-full w-full object-cover"
                src={Person}
              />
            </div>
            <div className="mt-4">
              <TypographyLarge className="">Aster Awoke</TypographyLarge>
              <TypographyMuted className="mt-1 text-neutral-600">
                Marketing Manager, Hourglass Supermarket
              </TypographyMuted>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="mt-10 max-w-5xl">
            <TypographyH1 className="leading-tight text-balance text-neutral-900">
              I sent my mom a Vyadove spa voucher from the U.S. — she loved it!
            </TypographyH1>
          </blockquote>

          {/* Helper line */}
          <TypographyLead className="mt-20">
            Trusted by over 50+ companies worldwide
          </TypographyLead>

          {/* Logos Row */}
          <Marquee
            className="mt-8 flex max-w-2xl gap-20"
            gradient
            gradientColor='bg-[#2A4A3A]/10'
            loop={0}
            pauseOnHover
          >
            {clientLogos.map((l) => (
              <div className="flex items-center gap-2 pl-8" key={l.name}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full">
                  {l.icon}
                </span>
                <span>{l.name}</span>
              </div>
            ))}
          </Marquee>
        </section>
      </div>
    </InvertedCornerMask>
  );
};

export default Testimonial;
