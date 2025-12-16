"use client";

import React, { useRef } from "react";
import Marquee from "react-fast-marquee";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

import Image from "next/image";

import companyIcons from "@/scenes/home/testimonial/list";
import { Button } from "@ui/shadcn/button";
import {
  TypographyH2,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
} from "@ui/shadcn/typography";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import { Swiper, SwiperSlide } from "swiper/react";

import InvertedCornerMask from "@/components/inverted-corner-mask";

import { cn } from "@/lib/utils";

import Person from "./img.png";
import Person2 from "./img_1.png";
import Person3 from "./img_2.png";
import Person4 from "./img_2.png";

const testimonials = [
  {
    name: "Aster Awoke",
    role: "Marketing Manager, Hourglass Supermarket",
    quote: "I sent my mom a Vyadove spa voucher from the U.S. — she loved it!",
    image: Person,
  },
  {
    name: "John Doe",
    role: "CEO, Example Corp",
    quote: "Vyadove made it so easy to find the perfect gift for my wife.",
    image: Person2,
  },
  {
    name: "Jane Smith",
    role: "Freelancer",
    quote:
      "I love the variety of experiences available on Vyadove. There's something for everyone!",
    image: Person3,
  },
  {
    name: "Michael Brown",
    role: "Product Manager, Tech Solutions",
    quote:
      "The customer service at Vyadove is top-notch. They really care about their customers.",
    image: Person4,
  },
];

const Testimonial = () => {
  const swiperRef = useRef<SwiperRef>(null);

  return (
    <InvertedCornerMask
      className={cn(
        "mt-24 w-full",
        "animate-gradient-xy flex w-full bg-linear-45 ",
        "from-[rgba(243,224,214,1)] from-20%  to-[#2A4A3A]/30 bg-[length:140%_100%] ",
      )}
      cornerContent={
        <div className="flex items-center justify-center gap-2 p-3 sm:p-6">
          <Button
            className="bg-accent/20 cursor-pointer text-black md:size-14"
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slidePrev();
              }
            }}
            size="icon-lg"
          >
            <AiOutlineArrowLeft className="" />
          </Button>

          <Button
            className="bg-accent/20 cursor-pointer text-black md:size-14"
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slideNext();
              }
            }}
            size="icon-lg"
          >
            <AiOutlineArrowRight />
          </Button>
        </div>
      }
      cornersRadius={15}
      invertedCorners={{
        tr: { inverted: true, corners: [20, 20, 20] },
      }}
    >
      <div className="flex h-full w-full flex-col gap-4 p-24 px-4">
        <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <Swiper
            autoplay={{
              delay: 2000,
            }}
            className="mySwiper max-w-full p-4 md:max-w-4xl"
            // effect={"fade"}
            grabCursor
            loop
            modules={[EffectFade]}
            ref={swiperRef}
          >
            {testimonials.map((customer, idx) => (
              <SwiperSlide className="p-4" key={idx}>
                <div className="flex flex-col items-center text-center">
                  {/* Avatar + Person */}
                  <div className="flex flex-col items-center">
                    <div className="size-24 overflow-hidden rounded-full shadow ring-2 ring-white">
                      <Image
                        alt={customer.name}
                        className="h-full w-full object-cover"
                        src={customer.image}
                      />
                    </div>
                    <div className="mt-2">
                      <TypographyLarge className="">
                        {customer.name}
                      </TypographyLarge>
                      <TypographyMuted className="text-neutral-600">
                        {customer.role}
                      </TypographyMuted>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="mt-6">
                    <TypographyH2 className="text-2xl leading-tight text-neutral-900 sm:text-4xl sm:text-balance">
                      “{customer.quote}”
                    </TypographyH2>
                  </blockquote>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Helper line */}
          <TypographyLead className="mt-5 sm:mt-10">
            Trusted by over {companyIcons.length}+ companies worldwide
          </TypographyLead>

          {/* Logos Row */}
          {/* <div className="flex w-full">
            <Marquee
              className="mx-auto mt-8 flex max-w-2xl gap-20"
              gradient
              gradientColor="bg-green-700/10"
              loop={0}
              pauseOnHover
            >
              {companyIcons.map((l, idx) => (
                <li className="flex items-center gap-2 border pl-8" key={idx}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full">{l.icon}</span>
                  <span>{l.name}</span>

                  <div
                    className={`bg-[url( relative h-[20px] w-[80px]${l})]`}
                  />
                </li>
              ))}
            </Marquee>
          </div> */}
        </section>
      </div>
    </InvertedCornerMask>
  );
};

export default Testimonial;
