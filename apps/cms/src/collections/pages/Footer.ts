import { admins, anyone } from "@/access/roles";
import { Block, CollectionConfig } from "payload";
import { groups } from "../groups";

const BasicFooter: Block = {
    slug: "basic-footer",
    fields: [
        {
            name: "copyright",
            type: "richText",
            required: true,
        },
    ],
};

export const FooterPage: CollectionConfig = {
    slug: "footer-page",
    labels: {
        singular: "Footer Page",
        plural: "Footer Page",
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
            blocks: [BasicFooter],
            maxRows: 1,
        },
    ],
};
