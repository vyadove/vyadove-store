import type { MetadataRoute } from "next";

import { publicUrl } from "@/env.mjs";
import { baseURL } from "@/resources";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: baseURL + "/sitemap.xml",
  };
}
