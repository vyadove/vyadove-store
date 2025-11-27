"use client";

import React, { Suspense } from "react";

import ShopScene from "@/scenes/shop";

export default function ShopPage() {
  return (
    <Suspense>
      <ShopScene />
    </Suspense>
  );
}
