import { baseURL } from "@/resources";

export default async function sitemap() {
  return [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },

    //  more links comming
  ];
}
