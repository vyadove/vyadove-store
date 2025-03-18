import type { Metadata } from "next";
import Nav from "../_templates/nav";
import Footer from "../_templates/footer";
import { Providers } from "@/providers/providers";
import { getStoreSettings } from "@/app/services/store-settings";

export const metadata: Metadata = {
    title: "Shopnex Payload CMS Starter Template",
    description:
        "A performant frontend ecommerce starter template with Payload and Shopnex.",
};

export default async function PageLayout(props: { children: React.ReactNode }) {
    const storeSettings = await getStoreSettings();
    return (
        <Providers>
            <Nav storeSettings={storeSettings} />
            {props.children}
            <Footer storeSettings={storeSettings} />
        </Providers>
    );
}
