"use client";

import { Link, useConfig, useTranslation } from "@payloadcms/ui";
import {
    EntityType,
    formatAdminURL,
    NavGroupType,
} from "@payloadcms/ui/shared";
import { usePathname } from "next/navigation";
import { getNavIcon } from "./navIconMap";
import { Home } from "lucide-react";
import { getTranslation } from "@payloadcms/translations";

type NavProps = {
    groups: NavGroupType[];
};

const baseClass = "nav";

export const NavClient = ({ groups }: NavProps) => {
    const pathname = usePathname();

    const {
        config: {
            routes: { admin: adminRoute },
        },
    } = useConfig();

    const { i18n } = useTranslation();

    const activeGroup = pathname
        .replace(adminRoute, "")
        .replace("/collections", "")
        .replace("/globals", "")
        .split("/")[1];

    const sortedGroups = groups.sort((a, b) => {
        if (a.label === "Settings") return 1;
        if (b.label === "Settings") return -1;
        return 0;
    });

    return (
        <div className="menu">
            <li className="group">
                <Link
                    href={adminRoute}
                    className={`${baseClass}__link group-toggle`}
                >
                    <Home size={16} />
                    {"Home"}
                </Link>
            </li>
            {sortedGroups.map(({ entities, label: groupLabel }, key) => {
                const Icon = getNavIcon(groupLabel.toLowerCase() as any);
                const groupSlug = groupLabel.toLowerCase();
                const selectedGroup =
                    entities.find((el) => el.slug === groupSlug) || entities[0];
                const isActiveGroup = entities.find(
                    (el) => el.slug === activeGroup
                );
                const filteredEntities = entities.filter(
                    (el) => el.slug !== activeGroup
                );
                return (
                    <li className="group" key={key}>
                        <Link
                            href={formatAdminURL({
                                adminRoute,
                                path: `/collections/${selectedGroup?.slug}`,
                            })}
                            className={`${baseClass}__link group-toggle`}
                        >
                            {Icon && <Icon size={16} />}
                            {getTranslation(groupLabel, i18n)}
                        </Link>
                        {isActiveGroup &&
                            filteredEntities.map(({ type, slug, label }) => {
                                let href: string | null = null;
                                let id: string;
                                if (type === EntityType.collection) {
                                    href = formatAdminURL({
                                        adminRoute,
                                        path: `/collections/${slug}`,
                                    });
                                    id = `nav-${slug}`;
                                }

                                if (type === EntityType.global) {
                                    href = formatAdminURL({
                                        adminRoute,
                                        path: `/globals/${slug}`,
                                    });
                                    id = `nav-global-${slug}`;
                                }
                                return (
                                    <Link
                                        key={slug}
                                        href={href || ""}
                                        className={`${baseClass}__link sub-group-list`}
                                    >
                                        {getTranslation(label, i18n)}
                                    </Link>
                                );
                            })}
                    </li>
                );
            })}
        </div>
    );
};
