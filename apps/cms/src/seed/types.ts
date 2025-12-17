/**
 * Types for seed data
 */

// Category seed data structure
export interface SeedSubcategory {
    title: string;
    description: string;
    visible: boolean;
}

export interface SeedCategory {
    title: string;
    description: string;
    visible: boolean;
    handle: string;
    subcategories?: SeedSubcategory[];
}

// Product variant for seeding (without id)
export interface SeedVariant {
    vid: string;
    sku: string;
    imageUrl?: string;
    price: {
        amount: number;
        currency: string;
    };
    originalPrice?: number | null;
    available: boolean;
    pricingTier: "basic" | "premium" | "luxury";
    options: Array<{
        option: string;
        value: string;
    }>;
    gallery: number[];
}

// Product seed data (without id - used for creation)
export interface SeedProduct {
    pid: string;
    title: string;
    currency: string;
    visible: boolean;
    salesChannels: string[];
    description: string;
    category: string;
    handle: string;
    variants: SeedVariant[];
    customFields: Array<{
        name: string;
        value: string;
    }>;
}

// Product template for generator
export interface ProductTemplate {
    titleTemplate: string[];
    descriptions: string[];
    category: string;
    priceRange: [number, number];
    pricingTier: "basic" | "premium" | "luxury";
    variantOptions: Array<{
        option: string;
        values: string[];
    }>;
    customFields: Array<{
        name: string;
        valueTemplate: string;
    }>;
}

// Category image mapping for context-aware thumbnails
export const CATEGORY_IMAGES: Record<string, string[]> = {
    "Fine Dining": [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    ],
    "Spa Days": [
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
    ],
    "Air Adventures": [
        "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&q=80",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80",
    ],
    "Cooking Classes": [
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
        "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800&q=80",
    ],
    "Romantic Getaways": [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    ],
    "Wine & Spirits": [
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
        "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800&q=80",
    ],
    "Massage Therapy": [
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
    ],
    "Yoga & Meditation": [
        "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    ],
    Photography: [
        "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&q=80",
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    ],
    "Brewery & Distillery": [
        "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
        "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80",
    ],
    "Water Sports": [
        "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80",
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
    ],
    "Afternoon Tea": [
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800&q=80",
    ],
    "Land Adventures": [
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
        "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&q=80",
    ],
    "Art Classes": [
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80",
    ],
    "Birthday Parties": [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
        "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80",
    ],
};

// Default fallback images
export const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
];

/**
 * Get contextual images for a category
 */
export function getCategoryImages(category: string): string[] {
    return CATEGORY_IMAGES[category] || DEFAULT_IMAGES;
}
