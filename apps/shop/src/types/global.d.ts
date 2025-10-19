import type React from "react";

export {};

declare global {
  type CornerKey = "tl" | "tr" | "br" | "bl";

  interface Setup {
    width: number;
    height: number;
    lockAspectRatio: number | null;
  }
  interface CornerRadius {
    tl: number;
    tr: number;
    br: number;
    bl: number;
  }

  interface InvertedCorner {
    width?: number;
    height?: number;
    roundedContent?: React.ReactNode;
    corners: [number, number, number];
    inverted: boolean;
  }

  interface InvertedCorners {
    tl?: InvertedCorner;
    tr?: InvertedCorner;
    br?: InvertedCorner;
    bl?: InvertedCorner;
  }
}
