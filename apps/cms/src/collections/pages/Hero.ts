import { admins, anyone } from "@/access/roles";
import type { BaseBlock, PageCollectionConfig } from "@/types/common";
import { groups } from "../groups";

const HeroBlock: BaseBlock = {
    slug: "hero",
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "subtitle",
            type: "text",
        },
        {
            name: "ctaButtonText",
            type: "text",
            label: "CTA Button Text",
        },
        {
            name: "ctaButtonLink",
            type: "text",
            label: "CTA Button Link",
        },
        {
            name: "backgroundImage",
            type: "upload",
            relationTo: "media",
        },
    ],
};

const CarouselBlock: BaseBlock = {
    slug: "carousel",
    fields: [
        {
            name: "title",
            type: "text",
            required: true,
        },
        {
            name: "subtitle",
            type: "text",
        },
        {
            name: "featuredProducts",
            type: "upload",
            hasMany: true,
            relationTo: "media",
        },
        {
            name: "backgroundImage",
            type: "upload",
            relationTo: "media",
        },
    ],
};

export const HeroPage: PageCollectionConfig = {
    slug: "hero-page",
    labels: {
        singular: "Hero Page",
        plural: "Hero Page",
    },
    access: {
        read: anyone,
        update: admins,
    },
    admin: {
        group: groups.design,
    },
    fields: [
        {
            name: "type",
            type: "blocks",
            blocks: [HeroBlock, CarouselBlock],
            maxRows: 1,
            required: true,
        },
    ],
};
