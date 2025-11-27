"use server";

import type { Product } from "@vyadove/types";

import { payloadSdk } from "@/utils/payload-sdk";

export async function searchProducts(query: string) {
  if (!query) return [];

  try {
    // Search in products collection
    // We are searching in title, description, and potentially category (if we can)
    // For now, let's focus on title and description (if it's a string field)
    // Note: Description might be rich text, which makes "like" queries harder.
    // Let's assume title is the main one for now.

    const products = await payloadSdk.find({
      collection: "products",
      where: {
        or: [
          {
            title: {
              like: query,
            },
          },
          // If description is a string, we can search it.
          // If it's lexical/rich text, we can't easily search it with 'like' in standard Payload without the search plugin.
          // Since the user mentioned the search plugin is configured, let's try to use the 'search' collection first.
        ],
      },
      limit: 10,
    });

    return products.docs as Product[];
  } catch (error) {
    console.error("Error searching products:", error);

    return [];
  }
}

export async function searchWithPlugin(query: string): Promise<Product[]> {
  if (!query) return [];

  try {
    const searchResults = await payloadSdk.find({
      collection: "search",
      where: {
        title: {
          like: query,
        },
      },
      limit: 10,
    });

    // Extract product IDs from search results
    // Search plugin returns docs with a 'doc' field that contains the relationship reference
    const productIds = searchResults.docs
      .map((searchDoc: any) => {
        // Handle both formats: direct relationship object or nested in doc
        const docRef = searchDoc.doc || searchDoc;

        if (docRef?.relationTo === "products" && docRef?.value) {
          return docRef.value;
        }

        return null;
      })
      .filter((id): id is number => id !== null);

    console.log("Product IDs from search:", productIds);

    if (productIds.length === 0) return [];

    // Fetch full product objects
    const products = await payloadSdk.find({
      collection: "products",
      where: {
        id: {
          in: productIds,
        },
      },
      depth: 2, // Get full product with relationships
    });

    return products.docs as Product[];
  } catch (error) {
    console.error("Error searching with plugin:", error);

    return [];
  }
}
