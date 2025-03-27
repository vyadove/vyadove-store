import {
  Blocks,
    ChartArea,
    Image,
    LucideProps,
    Palette,
    Settings,
    ShoppingCart,
    Tag,
    UserRound,
} from "lucide-react";
import { ExoticComponent } from "react";

const navIconMap = {
    products: Tag,
    analytics: ChartArea,
    orders: ShoppingCart,
    customers: UserRound,
    plugins: Blocks,
    settings: Settings,
    content: Image,
    design: Palette,
};

type NavIconSlug = keyof typeof navIconMap;

export const getNavIcon = (
    slug: NavIconSlug
): ExoticComponent<LucideProps> | undefined => {
    return navIconMap[slug];
};
