import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vydadove",
    short_name: "Vyadove",
    description: "Gift Joy, Share Peace,  Celebrate Life - Vyadove",
    start_url: "/",
    display: "standalone",
    background_color: "#d1f1de",
    theme_color: "#6da872",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
