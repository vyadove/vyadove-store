import type { GlobalConfig } from "payload";

import { admins, anyone } from "@/access/roles";
import currency from "currency-codes";
import { groups } from "@/collections/groups";

const StoreSettings: GlobalConfig = {
    slug: "store-settings",
    access: {
        read: anyone,
        update: admins,
    },
    admin: {
        group: groups.settings,
    },
    fields: [
        {
            name: "name",
            type: "text",
            defaultValue: "Vya-dove",
        },
        {
            name: "currency",
            type: "select",
            defaultValue: "USD",
            options: currency.codes().map((code) => ({
                label: `${currency.code(code)?.currency} (${currency.code(code)?.code})`,
                value: code,
            })),
        },
    ],
    label: "Settings",
};

export default StoreSettings;
