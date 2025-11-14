import type { Metadata } from "next/types";

import HomeScene from "@/scenes/home";

export const metadata: Metadata = {
  description: "Explore all of our gift experiences.",
  title: "Store",
};

export default async function Home() {
  return <HomeScene />;
}
