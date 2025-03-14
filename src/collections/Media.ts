import type { CollectionConfig } from "payload";
import { groups } from "./groups";

export const Media: CollectionConfig = {
	slug: "media",
	admin: {
		group: groups.content,
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: "alt",
			type: "text",
			required: true,
		},
	],
	upload: true,
};
