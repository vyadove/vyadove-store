import { admins, adminsOrSelf, anyone } from "@/access/roles";
import type { CollectionConfig } from "payload";
import { groups } from "./groups";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "email",
		group: groups.customers,
	},
	access: {
		create: anyone,
		read: adminsOrSelf,
		update: admins,
		delete: admins,
	},

	auth: true,
	fields: [
		// Email added by default
		{
			name: "firstName",
			type: "text",
			label: "First Name",
		},
		{
			name: "lastName",
			type: "text",
			label: "Last Name",
		},
		{
			name: "roles",
			type: "select",
            saveToJWT: true,
			defaultValue: ["customer"],
			hasMany: true,
			options: [
				{
					label: "admin",
					value: "admin",
				},
				{
					label: "customer",
					value: "customer",
				},
			],
		},
	],
};
