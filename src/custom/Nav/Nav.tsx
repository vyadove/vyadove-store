import { RenderServerComponent } from "@payloadcms/ui/elements/RenderServerComponent";
import { NavWrapper } from "./NavWrapper";
import { Logout } from "@payloadcms/ui";
import { ServerProps } from "payload";
import "./Nav.scss";
import {
    EntityToGroup,
    EntityType,
    groupNavItems,
} from "@payloadcms/ui/shared";
import { NavClient } from "./Nav.client";

const baseClass = "nav";

const Nav = async (props: ServerProps) => {
    const {
        documentSubViewType,
        i18n,
        locale,
        params,
        payload,
        permissions,
        searchParams,
        user,
        viewType,
        visibleEntities,
    } = props;
    const {
        admin: {
            components: { afterNavLinks, beforeNavLinks, logout },
        },
        collections,
        globals,
    } = payload.config;
    const LogoutComponent = RenderServerComponent({
        clientProps: {
            documentSubViewType,
            viewType,
        },
        Component: logout?.Button,
        Fallback: Logout,
        importMap: payload.importMap,
        serverProps: {
            i18n,
            locale,
            params,
            payload,
            permissions,
            searchParams,
            user,
        },
    });

    const groups = groupNavItems(
        [
            ...collections
                .filter(({ slug }) =>
                    visibleEntities?.collections.includes(slug)
                )
                .map(
                    (collection) =>
                        ({
                            type: EntityType.collection,
                            entity: collection,
                        }) satisfies EntityToGroup
                ),
            ...globals
                .filter(({ slug }) => visibleEntities?.globals.includes(slug))
                .map(
                    (global) =>
                        ({
                            type: EntityType.global,
                            entity: global,
                        }) satisfies EntityToGroup
                ),
        ],
        permissions as any,
        i18n
    );

    return (
        <NavWrapper baseClass={baseClass}>
            {RenderServerComponent({
                clientProps: {
                    documentSubViewType,
                    viewType,
                },
                Component: beforeNavLinks,
                importMap: payload.importMap,
                serverProps: {
                    i18n,
                    locale,
                    params,
                    payload,
                    permissions,
                    searchParams,
                    user,
                },
            })}
            <NavClient groups={groups} />
            {RenderServerComponent({
                clientProps: {
                    documentSubViewType,
                    viewType,
                },
                Component: afterNavLinks,
                importMap: payload.importMap,
                serverProps: {
                    i18n,
                    locale,
                    params,
                    payload,
                    permissions,
                    searchParams,
                    user,
                },
            })}
            <div className={`${baseClass}__controls`}>{LogoutComponent}</div>
        </NavWrapper>
    );
};

export default Nav;
