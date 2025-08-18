import type { LucideProps } from "lucide-react";
import type { ExoticComponent } from "react";

import {
    Blocks,
    ChartArea,
    Image,
    Palette,
    Settings,
    ShoppingCart,
    Tag,
    Target,
    UserRound,
} from "lucide-react";

const navIconMap = {
    analytics: ChartArea,
    content: Image,
    customers: UserRound,
    design: Palette,
    campaigns: Target,
    orders: ShoppingCart,
    plugins: Blocks,
    products: Tag,
    settings: Settings,
};

type NavIconSlug = keyof typeof navIconMap;

export const getNavIcon = (
    slug: NavIconSlug
): ExoticComponent<LucideProps> | undefined => {
    return navIconMap[slug];
};
