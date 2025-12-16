import { CollectionAfterChangeHook } from "payload";
import { Campaign, Media, StoreSetting } from "@vyadove/types";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

interface BrandingVars {
    store_name: string;
    logo_url: string;
    primary_color: string;
    accent_color: string;
    footer_text: string;
    address: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    linkedin_url: string;
    unsubscribe_url: string;
    current_year: string;
}

async function getBrandingVars(payload: any): Promise<BrandingVars> {
    const settings: StoreSetting = await payload.findGlobal({
        slug: "store-settings",
    });

    const branding = settings.emailBranding;
    const logo = branding?.logo as Media | undefined;

    return {
        store_name: settings.name || "Vyadove",
        logo_url: logo?.url || "",
        primary_color: branding?.primaryColor || "#000000",
        accent_color: branding?.accentColor || "#666666",
        footer_text: branding?.footerText || "",
        address: branding?.address || "",
        facebook_url: branding?.socialLinks?.facebook || "",
        instagram_url: branding?.socialLinks?.instagram || "",
        twitter_url: branding?.socialLinks?.twitter || "",
        linkedin_url: branding?.socialLinks?.linkedin || "",
        unsubscribe_url: branding?.unsubscribeUrl || "",
        current_year: String(new Date().getFullYear()),
    };
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
        const brandingVars = await getBrandingVars(req.payload);

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

            // Inject branding vars first
            for (const [key, value] of Object.entries(brandingVars)) {
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
                personalizedHtml = personalizedHtml.replace(regex, value);
            }

            // Then apply campaign-specific template data
            for (const [key, value] of Object.entries(templateData)) {
                const replacement = getReplacementValue(value, user);
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
                personalizedHtml = personalizedHtml.replace(regex, replacement);
            }

            // Legacy replacements for backwards compat
            personalizedHtml = personalizedHtml.replace(
                "{{campaign_id}}",
                doc.id.toString()
            );

            try {
                const fromName = brandingVars.store_name;
                const defaultFrom = `${fromName} <noreply@vyadove.com>`;

                await req.payload.sendEmail({
                    from: doc.profile?.from || defaultFrom,
                    replyTo: doc.profile?.replyTo || "support@vyadove.com",
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
