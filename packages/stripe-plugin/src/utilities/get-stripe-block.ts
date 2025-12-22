import { Payment } from "@vyadove/types";
import { PayloadRequest, PaginatedDocs } from "payload";

export const getStripeBlock = async ({
    req,
    shopId,
}: {
    req: PayloadRequest;
    shopId?: number;
}) => {
    // For single-tenant setups, just get the first payment config
    // For multi-tenant, filter by shop if the field exists
    const paymentsDocument = (await req.payload.find({
        collection: "payments",
        limit: 1,
    })) as PaginatedDocs<Payment>;

    const stripeBlock = paymentsDocument.docs[0]?.providers?.find(
        (provider: any) => provider.blockType === "stripe"
    );
    if (stripeBlock?.blockType === "stripe") {
        return stripeBlock;
    }
};
