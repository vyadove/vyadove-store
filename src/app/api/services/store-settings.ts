import { getPayload } from "payload";
import config from "@payload-config";

export const getStoreSettings = async () => {
    const payload = await getPayload({ config });
    const storeSettings = await payload.findGlobal({
        slug: "store-settings",
    });

    return storeSettings;
};
