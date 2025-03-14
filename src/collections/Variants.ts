import { admins, anyone } from "@/access/roles";
import type { CollectionConfig } from "payload";

export const Variants: CollectionConfig = {
	slug: "variants",
	access: {
		create: admins,
		read: anyone,
		update: admins,
		delete: admins,
	},
	admin: {
		hidden: true,
	},
	fields: [
		{
			name: "product",
			type: "relationship",
			relationTo: "products", // Assuming you have a Products collection
			required: true,
		},
		{
			name: "price",
			type: "number",
			required: true,
		},
		{
			name: "options",
			type: "json", // This allows flexible key-value storage
			required: true,
		},
	],
};
