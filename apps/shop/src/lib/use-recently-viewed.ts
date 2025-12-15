"use client";

import { useCallback, useEffect, useState } from "react";

import { getProductGallery } from "@/utils";
import type { Product } from "@vyadove/types";

export interface RecentlyViewedItem {
  id: number;
  handle: string;
  title: string;
  thumbnailUrl: string | null;
  categoryTitle: string | null;
  viewedAt: number;
}

export const RECENTLY_VIEWED_STORAGE_KEY = "vyadove-recently-viewed";
const MAX_ITEMS = 10;
const EXPIRY_DAYS = 30;
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

function getStoredItems(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);

    if (!stored) return [];

    const parsed = JSON.parse(stored) as RecentlyViewedItem[];
    const now = Date.now();

    // Filter out expired items
    return parsed.filter((item) => now - item.viewedAt < EXPIRY_MS);
  } catch {
    return [];
  }
}

function saveItems(items: RecentlyViewedItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage might be full or disabled
  }
}

export function useRecentlyViewed(excludeId?: number) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getStoredItems();

    setItems(stored);
    setIsLoaded(true);
  }, []);

  const addItem = useCallback((product: Product) => {
    const gallery = getProductGallery(product);
    const categoryRaw = Array.isArray(product.category)
      ? product.category[0]
      : product.category;
    // Category might be a number (ID) or populated object
    const categoryTitle =
      typeof categoryRaw === "object" && categoryRaw !== null
        ? categoryRaw.title
        : null;

    const newItem: RecentlyViewedItem = {
      id: product.id,
      handle: product.handle || String(product.id),
      title: product.title,
      thumbnailUrl: gallery[0]?.url || null,
      categoryTitle,
      viewedAt: Date.now(),
    };

    setItems((prev) => {
      // Remove existing entry if present
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to front, limit to MAX_ITEMS
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);

      saveItems(updated);

      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);

    if (typeof window !== "undefined") {
      localStorage.removeItem(RECENTLY_VIEWED_STORAGE_KEY);
    }
  }, []);

  // Filter out excluded item (current product page)
  const filteredItems =
    excludeId !== undefined
      ? items.filter((item) => item.id !== excludeId)
      : items;

  return {
    items: filteredItems,
    addItem,
    clearAll,
    isLoaded,
  };
}
