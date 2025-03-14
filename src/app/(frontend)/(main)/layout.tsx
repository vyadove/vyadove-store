import type { Metadata } from "next";
import Nav from "../_templates/nav";
import Footer from "../_templates/footer";
import { Providers } from "@/providers/providers";
import { getPayload } from "payload";
import config from "@payload-config";

export const metadata: Metadata = {
	title: "Shoplyjs Payload CMS Starter Template",
	description:
		"A performant frontend ecommerce starter template with Payload and ShoplyJS.",
};

export default async function PageLayout(props: { children: React.ReactNode }) {
	const payload = await getPayload({ config });
	const storeSettings = await payload.findGlobal({
		slug: "store-settings",
	});
	return (
		<Providers>
			<Nav storeSettings={storeSettings} />
			{props.children}
			<Footer storeSettings={storeSettings} />
		</Providers>
	);
}
