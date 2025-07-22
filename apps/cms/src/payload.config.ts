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
import { Footer } from "./globals/Footer";
import { HeroSection } from "./globals/HeroSection";
import StoreSettings from "./globals/StoreSettings";
import { plugins } from "./plugins";
import { Themes } from "./collections/Themes/Themes";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    admin: {
        importMap: {
            autoGenerate: false,
            baseDir: path.resolve(dirname),
        },
        suppressHydrationWarning: true,
        user: Users.slug,

        components: {
            Nav: "@/admin/components/Nav/Nav.tsx",
            views: {
                dashboard: {
                    Component: "@/admin/components/Dashboard/Dashboard",
                },
            },
        },
    },
    collections: [
        Orders,
        Collections,
        Products,
        Users,
        Media,
        Policies,
        GiftCards,
        Payments,
        Locations,
        Shipping,
        Carts,
        Themes,
    ],
    cors: {
        headers: ["x-shop-handle", "x-shop-id"],
        origins: [
            process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
            process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3020",
        ],
    },
    custom: {
        shopUrl:
            process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3020",
    },
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URI || "",
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
    ],
    globals: [StoreSettings, HeroSection, Footer],
    plugins,
    secret: process.env.PAYLOAD_SECRET || "",
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
    sharp,
    telemetry: false,
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
});
