"use client";

import { useEffect, useState } from "react";

import ColorThief from "colorthief";

type RGB = [number, number, number];

interface UseDominantColorResult {
  color: string | null;
  rgb: RGB | null;
  isLoading: boolean;
}

export const useDominantColor = (
  imageUrl: string | undefined,
): UseDominantColorResult => {
  const [color, setColor] = useState<string | null>(null);
  const [rgb, setRgb] = useState<RGB | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);

      return;
    }

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img) as RGB;

        setRgb(dominantColor);
        setColor(
          `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
        );
      } catch {
        // Fallback color if extraction fails
        setColor("rgb(42, 74, 58)");
        setRgb([42, 74, 58]);
      } finally {
        setIsLoading(false);
      }
    };

    img.onerror = () => {
      setColor("rgb(42, 74, 58)");
      setRgb([42, 74, 58]);
      setIsLoading(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  return { color, rgb, isLoading };
};
