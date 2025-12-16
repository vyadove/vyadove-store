import { getPayload } from "payload";

import { payloadSdk } from "@/utils/payload-sdk";

export const listCartPaymentMethods = async () => {
  const payments = await payloadSdk.find({
    collection: "payments",
  });

  return payments;
};
