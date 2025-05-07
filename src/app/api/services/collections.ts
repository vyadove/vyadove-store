import config from "@payload-config";
import { getPayload, Sort } from "payload";

export const getTopCollections = async () => {
    const payload = await getPayload({ config });
    const collections = await payload.find({
        collection: "collections",
        limit: 3,
    });
    return collections.docs;
};
