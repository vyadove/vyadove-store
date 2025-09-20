import { CollectionAfterChangeHook } from "payload";
import { Campaign } from "@shopnex/types";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const sendCampaignEmail: CollectionAfterChangeHook<Campaign> = async ({
    doc,
    req,
}) => {
    const logger = req.payload.logger;

    try {
        if (
            doc.type !== "email" ||
            doc.status !== "scheduled" ||
            req.context.skipAfterChange
        ) {
            logger.info(
                { docId: doc.id },
                "Skipping non-scheduled email campaign"
            );
            return;
        }

        const emailTemplate =
            typeof doc.emailTemplate === "object" ? doc.emailTemplate : null;

        if (!emailTemplate?.html) {
            logger.warn(
                { docId: doc.id },
                "No valid HTML template found for email campaign"
            );
            return;
        }

        const baseHtml = JSON.parse(emailTemplate.html).html;

        function getReplacementValue(value: any, user: any) {
            if (typeof value === "string" && value.startsWith("user.")) {
                const path = value.slice(5).split(".");
                let current = user;
                for (const key of path) {
                    if (!current || !(key in current)) return "";
                    current = current[key];
                }
                return current ?? "";
            }
            return value ?? "";
        }

        const templateData = doc.templateData ?? {};

        const delayBetweenEmails = 600;
        logger.info(
            { docId: doc.id, recipientCount: doc.recipients?.length },
            "Starting email dispatch"
        );

        for (const recipient of doc.recipients ?? []) {
            if (typeof recipient !== "object") {
                logger.warn({ recipient }, "Invalid recipient format");
                continue;
            }

            const user = typeof recipient === "object" ? recipient : null;

            let personalizedHtml = baseHtml;

            for (const [key, value] of Object.entries(templateData)) {
                const replacement = getReplacementValue(value, user);
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
                personalizedHtml = personalizedHtml.replace(regex, replacement);
            }

            personalizedHtml = personalizedHtml
                .replace(
                    /{{\s*current_year\s*}}/g,
                    String(new Date().getFullYear())
                )
                .replace("{{campaign_id}}", doc.id.toString());

            try {
                await req.payload.sendEmail({
                    from: doc.profile?.from ?? "ShopNex <noreply@shopnex.ai>",
                    replyTo: doc.profile?.replyTo ?? "support@shopnex.ai",
                    subject: doc.subject,
                    html: personalizedHtml,
                    to: user?.email,
                });

                logger.info(
                    { docId: doc.id, email: user?.email },
                    "Email sent successfully"
                );

                if (typeof doc.metrics?.sent === "number") {
                    doc.metrics.sent++;
                }
            } catch (emailError) {
                logger.error(
                    {
                        docId: doc.id,
                        error: emailError,
                        email: user?.email,
                    },
                    "Error sending email"
                );
            }

            await sleep(delayBetweenEmails);
        }
    } catch (error) {
        logger.error(
            { docId: doc.id, error },
            "Unhandled error in sendCampaignEmail"
        );
    }

    return doc;
};
