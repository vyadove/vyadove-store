import type { GlobalConfig } from "payload";

import link from "../fields/link";
import { groups } from "@/collections/groups";
import { FormBlock } from "@/blocks/Form";

export const MainMenu: GlobalConfig = {
    slug: "main-menu",
    access: {
        read: () => true,
    },
    admin: {
        group: groups.settings,
    },
    fields: [
        {
            type: "tabs",
            tabs: [
                {
                    fields: [
                        {
                            name: "layout",
                            type: "blocks",
                            blocks: [FormBlock],
                            required: true,
                        },
                    ],
                    label: "Forms Content",
                },
                {
                    fields: [
                        {
                            name: "form-submissions",
                            type: "relationship",
                            relationTo: "form-submissions",
                        },
                    ],
                    label: "Forms Submissions",
                },
            ],
        },

        {
            name: "navItems",
            type: "array",
            fields: [
                link({
                    // appearances: false,
                }),
            ],
            maxRows: 6,
        },
    ],
};
