import type { Metadata } from "next/types";

import { publicUrl } from "@/env.mjs";
import { Collections } from "@/scenes/collections";
import Hero from "@/scenes/home/hero";
import HowItWorks from "@/scenes/home/how-it-works";
import { PopularGifts } from "@/scenes/home/popular-gifts";
import { QnAs } from "@/scenes/home/qna";
import Testimonial from "@/scenes/home/testimonial";

export const metadata: Metadata = {
  description: "Explore all of our gift experiences.",
  title: "Store",
};


export default async function Home() {

  return (
    <main>
      <Hero />

      <PopularGifts />

      <HowItWorks />

      <Collections />

      <Testimonial />

      <QnAs />
    </main>
  );
}
