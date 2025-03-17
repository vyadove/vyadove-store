import { admins } from "@/access/roles";
import { Block, GlobalConfig } from "payload";

const BasicFooter: Block = {
    slug: "basic-footer",
    fields: [
        {
            name: "copyright",
            type: "richText",
            required: true,
        },
        {
            name: "poweredBy",
            type: "richText",
        }
    ],
};

export const Footer: GlobalConfig = {
    slug: "footer",
    admin: {
        group: "Settings",
    },
    access: {
        read: admins,
        update: admins,
    },
    fields: [
        {
            name: "type",
            type: "blocks",
            blocks: [
                BasicFooter
            ],
            maxRows: 1
        },
    ],
};
