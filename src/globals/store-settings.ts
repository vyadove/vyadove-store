import { admins, anyone } from "@/access/roles";
import type { GlobalConfig } from "payload";

const StoreSettings: GlobalConfig = {
	slug: "store-settings",
	label: "General",
	access: {
		read: anyone,
		update: admins,
	},
	admin: {
		group: "Settings",
	},
	fields: [
		{
			name: "name",
			type: "text",
			defaultValue: "ShoplyJS",
		},
		{
			name: "currency",
			type: "text",
			defaultValue: "USD",
		},
	],
};

export default StoreSettings;
