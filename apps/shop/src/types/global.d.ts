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

  /** Config for a single inverted (concave) corner. Presence of object implies inverted. */
  interface InvertedCorner {
    width?: number;
    height?: number;
    roundness?: number;
    /** @deprecated Arc radii default to cornersRadius. Only use for custom per-arc values. */
    corners?: [number, number, number];
    /** @deprecated Presence of corner config implies inverted. No need to set explicitly. */
    inverted?: boolean;
    /** Content to render in the inverted corner cutout */
    content?: React.ReactNode;
  }

  interface InvertedCorners {
    tl?: InvertedCorner;
    tr?: InvertedCorner;
    br?: InvertedCorner;
    bl?: InvertedCorner;
  }

  /** Border configuration for InvertedCornerMask */
  interface InvertedCornerBorder {
    width: number;
    color: string;
    /** Show border only on hover (default: false) */
    showOnHover?: boolean;
  }
}
