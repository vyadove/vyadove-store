import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Carts } from "./collections/Carts/Carts";
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
import { CheckoutSessions } from "./collections/CheckoutSessions/CheckoutSessions";
import { FooterPage } from "./collections/pages/Footer";

import { HeroPage } from "./collections/pages/Hero";

import { TermsAndCollectionsPage } from "./collections/pages/TermsAndConditions";

import { PrivacyPolicyPage } from "./collections/pages/privacy-policy";
import { Campaigns } from "./collections/Campaigns/Campaigns";
import { Plugins } from "./collections/Plugins/Plugins";
import { syncPlugin } from "./collections/Plugins/utils/sync-plugin";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { seed } from "@/seed";
import { admins, checkRole } from "@/access/roles";
import { migrations } from "./migrations";
import { Support } from "@/collections/pages/support";
import { Forms } from "@/collections/pages/Forms";
import { MainMenu } from "@/globals/MainMenu";
import { seedForms } from "@/seed/seed-forms";
import { Category } from "@/collections/category";
import { Checkouts } from "@/collections/checkout";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// console.log('process.env.DATABASE_URL ----------------------------- : ', process.env.DATABASE_URL);

export default buildConfig({
    routes: {
        admin: "/",
    },
    admin: {
        autoLogin: {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        },
        importMap: {
            autoGenerate: false,
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
        Carts,
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
        CheckoutSessions,
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
    // db: sqliteAdapter({
    //     client: {
    //         url: process.env.DATABASE_URI || "",
    //     },
    // }),


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

    editor: lexicalEditor(),
    endpoints: [
        {
            handler: (req) => {
                return Response.json({ status: "OK" });
            },
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
    ],
    plugins,
    secret: process.env.PAYLOAD_SECRET || "",
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
    sharp: sharp as any,
    telemetry: false,
    typescript: {
        outputFile: path.resolve(dirname, "../../../packages/types/index.ts"),
    },
});
