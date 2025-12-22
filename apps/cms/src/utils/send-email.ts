import type { Payload } from "payload";
import type { Media, StoreSetting } from "@vyadove/types";

export type EmailType =
    | "order_confirmation"
    | "order_cancellation"
    | "payment_failed"
    | "order_shipped"
    | "order_delivered"
    | "gift_delivery";

interface EmailBranding {
    storeName: string;
    logoUrl: string;
    primaryColor: string;
    accentColor: string;
    footerText: string;
    address: string;
    supportEmail: string;
}

interface GiftMessageData {
    enabled?: boolean | null;
    recipientName?: string | null;
    senderName?: string | null;
    message?: string | null;
}

interface EmailData extends Record<string, string | GiftMessageData | undefined> {
    orderId?: string;
    retryUrl?: string;
    trackingUrl?: string;
    giftMessage?: GiftMessageData;
}

interface SendEmailParams {
    payload: Payload;
    to: string;
    type: EmailType;
    data: EmailData;
}

/**
 * Fetch email branding from store settings
 */
async function getEmailBranding(payload: Payload): Promise<EmailBranding> {
    try {
        const settings: StoreSetting = await payload.findGlobal({
            slug: "store-settings",
        });

        const branding = settings.emailBranding;
        const logo = branding?.logo as Media | undefined;

        return {
            storeName: settings.name || "Vyadove",
            logoUrl: logo?.url || "",
            primaryColor: branding?.primaryColor || "#000000",
            accentColor: branding?.accentColor || "#666666",
            footerText:
                branding?.footerText?.replace(
                    "{{current_year}}",
                    String(new Date().getFullYear())
                ) ||
                `© ${new Date().getFullYear()} Vyadove. All rights reserved.`,
            address: branding?.address || "",
            supportEmail: "support@vyadove.com",
        };
    } catch {
        return {
            storeName: "Vyadove",
            logoUrl: "",
            primaryColor: "#000000",
            accentColor: "#666666",
            footerText: `© ${new Date().getFullYear()} Vyadove. All rights reserved.`,
            address: "",
            supportEmail: "support@vyadove.com",
        };
    }
}

/**
 * Wrap content in branded email template
 */
function wrapInBrandedTemplate(
    content: string,
    branding: EmailBranding
): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; max-width: 100%;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: ${branding.primaryColor}; padding: 24px; text-align: center;">
                            ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.storeName}" style="max-height: 48px; max-width: 200px;">` : `<h1 style="color: #ffffff; margin: 0; font-size: 24px;">${branding.storeName}</h1>`}
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 24px;">
                            ${content}
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 24px; text-align: center; border-top: 1px solid #eee;">
                            <p style="color: ${branding.accentColor}; font-size: 13px; margin: 0 0 8px 0;">
                                ${branding.footerText}
                            </p>
                            ${branding.address ? `<p style="color: #999; font-size: 12px; margin: 0;">${branding.address}</p>` : ""}
                            <p style="color: #999; font-size: 12px; margin: 8px 0 0 0;">
                                Questions? Contact us at <a href="mailto:${branding.supportEmail}" style="color: ${branding.primaryColor};">${branding.supportEmail}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

interface EmailTemplate {
    subject: string;
    content: string;
}

type TemplateGenerator = (
    data: EmailData,
    branding: EmailBranding
) => EmailTemplate;

const EMAIL_TEMPLATES: Record<EmailType, TemplateGenerator> = {
    order_confirmation: (data, branding) => ({
        subject: `Order Confirmed - ${data.orderId}`,
        content: `
            <h1 style="color: #333; margin: 0 0 16px 0; font-size: 24px;">Thank you for your order!</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
                Your order <strong>${data.orderId}</strong> has been confirmed and is being processed.
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
                We'll send you another email when your order ships.
            </p>
            <div style="background-color: #f5f5f5; padding: 16px; border-radius: 4px; margin-bottom: 16px;">
                <p style="color: #333; font-size: 14px; margin: 0;">
                    <strong>Order ID:</strong> ${data.orderId}
                </p>
            </div>
            ${
                data.giftMessage?.enabled
                    ? `
            <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid ${branding.primaryColor}; margin: 24px 0; border-radius: 0 4px 4px 0;">
                <p style="font-size: 13px; color: #666; margin: 0 0 8px 0; font-weight: 500;">
                    To: ${data.giftMessage.recipientName || ""} &nbsp;|&nbsp; From: ${data.giftMessage.senderName || ""}
                </p>
                <p style="font-size: 14px; color: #333; margin: 0; white-space: pre-wrap; line-height: 1.5;">${data.giftMessage.message || ""}</p>
            </div>`
                    : ""
            }
        `,
    }),

    order_cancellation: (data, branding) => ({
        subject: `Order Cancelled - ${data.orderId}`,
        content: `
            <h1 style="color: #333; margin: 0 0 16px 0; font-size: 24px;">Order Cancelled</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
                Your order <strong>${data.orderId}</strong> has been cancelled.
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
                If you didn't request this cancellation or have any questions, please contact our support team.
            </p>
        `,
    }),

    payment_failed: (data, branding) => ({
        subject: `Payment Failed - ${data.orderId}`,
        content: `
            <h1 style="color: #d32f2f; margin: 0 0 16px 0; font-size: 24px;">Payment Failed</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
                We were unable to process payment for your order <strong>${data.orderId}</strong>.
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
                Don't worry - your items are still saved. Please try again using the button below.
            </p>
            <div style="text-align: center; margin: 24px 0;">
                <a href="${data.retryUrl}"
                   style="display: inline-block; background-color: ${branding.primaryColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px;">
                    Retry Payment
                </a>
            </div>
            <p style="color: #999; font-size: 14px; text-align: center; margin: 16px 0 0 0;">
                Link not working? Copy and paste this URL into your browser:<br>
                <span style="color: #666; word-break: break-all;">${data.retryUrl}</span>
            </p>
        `,
    }),

    order_shipped: (data, branding) => ({
        subject: `Your Order is On Its Way! - ${data.orderId}`,
        content: `
            <h1 style="color: #333; margin: 0 0 16px 0; font-size: 24px;">Your order is on its way!</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
                Great news! Your order <strong>${data.orderId}</strong> has been shipped.
            </p>
            ${
                data.trackingUrl
                    ? `
            <div style="text-align: center; margin: 24px 0;">
                <a href="${data.trackingUrl}"
                   style="display: inline-block; background-color: ${branding.primaryColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px;">
                    Track Your Order
                </a>
            </div>`
                    : ""
            }
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0;">
                Thank you for shopping with us!
            </p>
        `,
    }),

    order_delivered: (data, branding) => ({
        subject: `Order Delivered - ${data.orderId}`,
        content: `
            <h1 style="color: #333; margin: 0 0 16px 0; font-size: 24px;">Your order has been delivered!</h1>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
                Your order <strong>${data.orderId}</strong> has been delivered.
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0;">
                We hope you love your purchase! If you have any questions or concerns, please don't hesitate to reach out.
            </p>
        `,
    }),

    gift_delivery: (data, branding) => ({
        subject: `You've received a gift from ${data.giftMessage?.senderName || "someone special"}!`,
        content: `
            <h1 style="color: #333; margin: 0 0 16px 0; font-size: 24px;">
                ${data.giftMessage?.recipientName ? `Dear ${data.giftMessage.recipientName},` : "Hello!"}
            </h1>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 24px 0;">
                You've received a thoughtful gift from <strong>${data.giftMessage?.senderName || "someone special"}</strong>!
            </p>
            ${
                data.giftMessage?.message
                    ? `
            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid ${branding.primaryColor}; margin: 24px 0; border-radius: 0 4px 4px 0;">
                <p style="font-size: 13px; color: #666; margin: 0 0 12px 0; font-weight: 500;">
                    A personal message from ${data.giftMessage.senderName || "your gift sender"}:
                </p>
                <p style="font-size: 15px; color: #333; margin: 0; white-space: pre-wrap; line-height: 1.6; font-style: italic;">"${data.giftMessage.message}"</p>
            </div>`
                    : ""
            }
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 24px 0 0 0;">
                Check your inbox for more details about your gift. If you have any questions, feel free to reach out to us.
            </p>
        `,
    }),
};

/**
 * Send transactional email with branding from store settings
 */
export async function sendEmail({
    payload,
    to,
    type,
    data,
}: SendEmailParams): Promise<boolean> {
    const logger = payload.logger;

    try {
        const branding = await getEmailBranding(payload);
        const template = EMAIL_TEMPLATES[type](data, branding);
        const html = wrapInBrandedTemplate(template.content, branding);

        await payload.sendEmail({
            to,
            from: `${branding.storeName} <noreply@vyadove.com>`,
            subject: template.subject,
            html,
        });

        logger.info(`📧 Email sent: ${type} to ${to}`);
        return true;
    } catch (error) {
        logger.error(
            `❌ Failed to send ${type} email to ${to}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        return false;
    }
}
