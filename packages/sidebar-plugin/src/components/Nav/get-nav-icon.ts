import type { LucideProps } from "lucide-react";
import type { ExoticComponent } from "react";
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
    settings: Settings,
    platform: Settings2,
};

type NavIconSlug = keyof typeof navIconMap;

export const getNavIcon = (
    slug: NavIconSlug
): ExoticComponent<LucideProps> | undefined => {
    return navIconMap[slug];
};
