import AccessoriesImage from "@/images/accessories.jpg";
import ApparelImage from "@/images/apparel.jpg";

const name = process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME || "Vyadove.";
const copyright = process.env.NEXT_PUBLIC_BLOG_COPYRIGHT || "Vyadove";
const defaultTitle = process.env.NEXT_DEFAULT_METADATA_DEFAULT_TITLE || "Vyadove";
const defaultDescription = process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || "Vyadove — Gift Joy. Share Peace.";

export const config = {
	categories: [
		{ name: "Apparel", slug: "apparel", image: ApparelImage },
		{ name: "Accessories", slug: "accessories", image: AccessoriesImage },
		{ name: "Wearable", slug: "accessories", image: AccessoriesImage },
	],

	social: {
		x: "https://x.com/yourstore",
		facebook: "https://facebook.com/yourstore",
	},

	contact: {
		email: "support@yourstore.com",
		phone: "+1 (555) 111-4567",
		address: "123 Store Street, City, Country",
	},

	// seo
	baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
	store: {
		name,
		copyright,
		metadata: {
			title: {
				absolute: defaultTitle,
				default: defaultTitle,
				template: `%s - ${defaultTitle}`,
			},
			description: defaultDescription,
		},
	},
	ogImageSecret: process.env.OG_IMAGE_SECRET || "secret_used_for_signing_and_verifying_the_og_image_url",
};

export type StoreConfig = typeof config;
export default config;
