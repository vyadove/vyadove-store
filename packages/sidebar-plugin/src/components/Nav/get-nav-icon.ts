import type { LucideProps } from "lucide-react";
import React, { ExoticComponent } from "react";
import {
    Blocks,
    ChartSpline,
    Image,
    Palette,
    Settings,
    Settings2,
    ShoppingCart,
    Tag,
    Target,
    UserRound,
    Library
} from "lucide-react";

const navIconMap = {
    analytics: ChartSpline,
    content: Image,
    customers: UserRound,
    design: Palette,
    campaigns: Target,
    orders: ShoppingCart,
    plugins: Blocks,
    products: Tag,
    collections: Library,
    settings: Settings,
    platform: Settings2,
};

type NavIconSlug = keyof typeof navIconMap;

export const getNavIcon = (
    slug: string,
    groupsConfig?: Record<string, { name: string; icon: string }>
): ExoticComponent<LucideProps> | undefined => {
    if (groupsConfig && groupsConfig[slug]) {
        const iconName = groupsConfig[slug].icon;
        console.log(`getNavIcon: found icon name "${iconName}" for slug="${slug}" in groups config`);

        // Dynamically get icon from Lucide
        const IconComponent = (LucideIcons as any)[iconName];
        return IconComponent;
    }

    console.log(`getNavIcon: no icon found for slug="${slug}"`);
    return undefined;
};
