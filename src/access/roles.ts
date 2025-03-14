import type { AccessArgs, Access } from "payload";

import type { User } from "@/payload-types";

export const checkRole = (roles: User["roles"] = [], user?: User | null) =>
    !!user?.roles?.some((role) => roles?.includes(role));

type isAdmin = (args: AccessArgs<User>) => boolean;

export const admins: isAdmin = ({ req: { user } }) => {
	return checkRole(["admin"], user);
};

export const anyone: Access = () => true;

export const adminsOrSelf: Access = ({ req: { user } }) => {
	if (user) {
		if (checkRole(["admin"], user)) {
			return true;
		}

		return {
			id: {
				equals: user.id,
			},
		};
	}

	return false;
};
