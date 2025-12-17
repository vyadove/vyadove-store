import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Collections } from "./collections/Collections";
import { GiftCards } from "./collections/GiftCards";
import { Locations } from "./collections/Locations";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders/Orders";
import { Payments } from "./collections/Payments";
import { Policies } from "./collections/Policies";
import { Products } from "./collections/Products/Products";
import { Shipping } from "./collections/Shipping";
import { Users } from "./collections/Users";
import StoreSettings from "./globals/StoreSettings";
import { plugins } from "./plugins";
import { Themes } from "./collections/Themes/Themes";
import { FooterPage } from "./collections/pages/Footer";

import { HeroPage } from "./collections/pages/Hero";

import { TermsAndCollectionsPage } from "./collections/pages/TermsAndConditions";

import { PrivacyPolicyPage } from "./collections/pages/privacy-policy";
import { Campaigns } from "./collections/Campaigns/Campaigns";
import { Plugins } from "./collections/Plugins/Plugins";
import { syncPlugin } from "./collections/Plugins/utils/sync-plugin";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { migrations } from "./migrations";
import { Support } from "@/collections/pages/support";
import { Forms } from "@/collections/pages/Forms";
import { MainMenu } from "@/globals/MainMenu";
import { Category } from "@/collections/category";
import { Checkouts } from "@/collections/checkout";
import { endpoints } from "@/endpoints";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// console.log('process.env.DATABASE_URL ----------------------------- : ', process.env.DATABASE_URL);

export default buildConfig({
    routes: {
        admin: "/",
    },
    admin: {
        importMap: {
            baseDir: path.resolve(dirname),
        },
        suppressHydrationWarning: true,
        user: Users.slug,

        meta: {
            title: "Vyadove CMS",
            titleSuffix: " - Vyadove CMS",

            icons: [
                {
                    rel: "icon",
                    type: "image/png",
                    url: "/favicon-16x16.png",
                },
            ],
        },
    },
    collections: [
        Orders,
        Collections,
        Category,
        Products,
        Users,
        Campaigns,
        Media,
        Policies,

        GiftCards,
        Themes,
        Checkouts,

        // Pages
        HeroPage,
        FooterPage,
        PrivacyPolicyPage,
        TermsAndCollectionsPage,
        Support,
        Forms,

        Plugins,
        Payments,
        Locations,
        Shipping,
    ],
    globals: [StoreSettings, MainMenu],
    cors: {
        headers: ["x-payload-sdk-token"],
        origins: [
            process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
            process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3020",
            process.env.NEXT_PUBLIC_EASY_EMAIL_URL || "http://localhost:3040",
        ],
    },
    custom: {
        shopUrl:
            process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3020",
        syncPlugin,
    },
    db: postgresAdapter({
        prodMigrations: migrations,
        // logger: true,

        pool: {
            // connectionString: process.env.DATABASE_URI,
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false, // Disables SSL certificate verification
            },
        },
    }),

    email: resendAdapter({
        defaultFromAddress: "hello@vyadove.com",
        defaultFromName: process.env.RESEND_FROM_NAME || "",
        apiKey: process.env.RESEND_API_KEY || "",
    }),

    editor: lexicalEditor(),
    endpoints,
    plugins,
    secret: process.env.PAYLOAD_SECRET || "",
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
    sharp: sharp as any,
    telemetry: false,
    typescript: {
        outputFile: path.resolve(dirname, "../../../packages/types/index.ts"),
    },
});
