import type { Endpoint } from "payload";
import { checkRole } from "@/access/roles";
import { seed } from "@/seed";

export const endpoints: Endpoint[] = [
    {
        handler: () => Response.json({ status: "OK" }),
        method: "get",
        path: "/healthz",
    },
    {
        handler: async (req) => {
            if (!checkRole(["admin"], req?.user)) {
                return Response.json(
                    { status: "UNAUTHORIZED" },
                    { status: 403 }
                );
            }

            try {
                await seed();
                return Response.json({ status: "SEED OK" });
            } catch (error) {
                return Response.json({ status: "ERROR", error });
            }
        },
        method: "get",
        path: "/seed",
    },
    {
        handler: async (req) => {
            if (!checkRole(["admin"], req?.user)) {
                return Response.json(
                    { status: "UNAUTHORIZED" },
                    { status: 403 }
                );
            }

            try {
                // Delete existing search docs
                const existing = await req.payload.find({
                    collection: "search",
                    limit: 10000,
                });
                for (const doc of existing.docs) {
                    await req.payload.delete({
                        collection: "search",
                        id: doc.id,
                    });
                }

                // Re-save all products to trigger search sync
                const products = await req.payload.find({
                    collection: "products",
                    limit: 10000,
                });
                for (const product of products.docs) {
                    await req.payload.update({
                        collection: "products",
                        id: product.id,
                        data: {},
                    });
                }

                return Response.json({
                    status: "REINDEX OK",
                    count: products.docs.length,
                });
            } catch (error) {
                return Response.json(
                    { status: "ERROR", error: String(error) },
                    { status: 500 }
                );
            }
        },
        method: "post",
        path: "/reindex-search",
    },
    // test email adapter endpoint
    {
        handler: async (req) => {
            if (!checkRole(["admin"], req?.user)) {
                return Response.json(
                    { error: "Unauthorized" },
                    { status: 403 }
                );
            }

            const url = new URL(req.url || "", "http://localhost");
            const to = url.searchParams.get("to");

            if (!to) {
                return Response.json(
                    { error: "Missing 'to' query param" },
                    { status: 400 }
                );
            }

            try {
                const settings = await req.payload.findGlobal({
                    slug: "store-settings",
                });
                const branding = settings.emailBranding;
                const logo =
                    typeof branding?.logo === "object" ? branding.logo : null;

                const html = `
                        <!DOCTYPE html>
                        <html>
                        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="text-align: center; padding: 20px; background: #f4f4f4; border-radius: 8px 8px 0 0;">
                                ${logo?.url ? `<img src="${logo.url}" alt="${settings.name}" style="max-height: 60px;" />` : `<h1 style="color: ${branding?.primaryColor || "#000"};">${settings.name || "Vyadove"}</h1>`}
                            </div>
                            <div style="padding: 30px; background: #fff;">
                                <h2 style="color: ${branding?.primaryColor || "#000"};">Test Email</h2>
                                <p>This is a test email from <strong>${settings.name || "Vyadove"}</strong>.</p>
                                <p>If you received this, your SMTP configuration is working correctly.</p>
                                <p style="margin-top: 20px;">
                                    <a href="#" style="background: ${branding?.primaryColor || "#000"}; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Test Button</a>
                                </p>
                            </div>
                            <div style="padding: 20px; background: #fafafa; text-align: center; font-size: 12px; color: ${branding?.accentColor || "#666"}; border-radius: 0 0 8px 8px;">
                                <p>${branding?.address || ""}</p>
                                <p>${branding?.footerText?.replace("{{current_year}}", String(new Date().getFullYear())) || `© ${new Date().getFullYear()} ${settings.name}`}</p>
                            </div>
                        </body>
                        </html>
                    `;

                const res = await req.payload.sendEmail({
                    to,
                    subject: `---- Test Email from ${settings.name || "Vyadove"}`,
                    html,
                });

                console.log("res  ---: ", res);

                return Response.json({
                    success: true,
                    message: `Test email sent to ${to}`,
                });
            } catch (error: any) {
                return Response.json(
                    { error: error.message || "Failed to send email" },
                    { status: 500 }
                );
            }
        },
        method: "get",
        path: "/test-email",
    },
];
