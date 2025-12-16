// revalidate the shop page when products are updated at vidadove.com
import { PayloadRequest } from "payload";
import { Product } from "@vyadove/types";

export const revalidateShop = async ({
    req,
    doc,
}: {
    req: PayloadRequest;
    doc: Product;
}): Promise<void> => {
    // if this is local dev ignore
    if (process.env.IS_LOCAL_SERVER) {
        console.log("skipping revalidation on local server");
        return;
    }

    req.payload.logger.info(
        `Starting revalidation of shop page due to product update: ${doc.id}`
    );

    try {
        const secret = process.env.REVALIDATION_SECRET_TOKEN;
        if (!secret) {
            req.payload.logger.error(
                `Revalidation secret token is not set in environment variables.`
            );
            return;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STOREFRONT_URL}/api/revalidate?secret=${secret}`,
            {
                method: "GET",
            }
        );

        if (response.ok) {
            req.payload.logger.info(
                `Successfully triggered revalidation for shop page due to product update: ${doc.id}`
            );
        } else {
            req.payload.logger.error(
                `Failed to trigger revalidation for shop page. Status: ${response.status} - ${response.statusText}`
            );
        }
    } catch (error: any) {
        req.payload.logger.error(
            `Error during revalidation request for product ${doc.id}: ${error.message}`
        );
    }
};
