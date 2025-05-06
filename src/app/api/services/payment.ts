import config from "@payload-config";
import { getPayload } from "payload";

export const listCartPaymentMethods = async () => {
    const payload = await getPayload({ config });
    const payments = await payload.find({
        collection: "payments",
    });
    return payments;
};
