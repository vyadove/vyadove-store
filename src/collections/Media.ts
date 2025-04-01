import type { CollectionConfig } from "payload";
import { groups } from "./groups";
import { admins, anyone } from "@/access/roles";

export const Media: CollectionConfig = {
	slug: "media",
	admin: {
		group: groups.content,
	},
	access: {
		read: anyone,
		create: admins,
		update: admins,
		delete: admins,
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
