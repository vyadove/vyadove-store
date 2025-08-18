import { Endpoint } from "payload";

function isNumber(str: string) {
    return !isNaN(Number(str));
}

export const openEmailEndpoint: Endpoint = {
    path: "/open-email/:campaignId",
    method: "get",
    handler: async (req) => {
        const campaignId = req.routeParams?.campaignId as string;

        if (!isNumber(campaignId)) {
            return Response.json(
                { error: "Invalid campaign ID" },
                { status: 400 }
            );
        }

        const logger = req.payload.logger;

        if (!campaignId) {
            logger.error("Campaign ID is missing from request parameters");
            return Response.json(
                { error: "Campaign ID is required" },
                { status: 400 }
            );
        }

        try {
            logger.info(`Fetching campaign with ID: ${campaignId}`);
            const campaign = await req.payload.findByID({
                collection: "campaigns",
                id: campaignId,
                depth: 1,
                req,
            });

            if (!campaign) {
                logger.error(`Campaign not found with ID: ${campaignId}`);
                return Response.json(
                    { error: "Campaign not found" },
                    { status: 404 }
                );
            }

            const openedEmails = campaign.metrics?.opened || 0;
            const newOpenedEmails = openedEmails + 1;

            logger.info(
                `Updating opened email count for campaign ID: ${campaignId}`
            );
            req.context.skipAfterChange = true;
            await req.payload.update({
                collection: "campaigns",
                id: campaignId,
                data: {
                    metrics: {
                        opened: newOpenedEmails,
                    },
                },
                req,
            });

            logger.info(
                `Successfully updated campaign ${campaignId} with new opened count: ${newOpenedEmails}`
            );

            const pixel = Buffer.from(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
                "base64"
            );

            return new Response(pixel, {
                headers: { "Content-Type": "image/png" },
            });
        } catch (error) {
            logger.error(error, `Error processing campaign ID: ${campaignId}`);
            return Response.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        }
    },
};
