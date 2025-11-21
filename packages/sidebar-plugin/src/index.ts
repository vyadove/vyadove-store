import type { Config } from "payload";
import pkg from "../package.json";

type SidebarPluginConfig = {
    enabled?: boolean;
    groups?: Record<string, { name: string; icon: string }>;
};

export const sidebarPlugin = (pluginConfig: SidebarPluginConfig = {}) => {
    return (config: Config): Config => {
        if (pluginConfig.enabled === false) {
            return config;
        }

        config.admin = {
            ...(config.admin ?? {}),
            components: {
                ...(config.admin?.components ?? {}),
                Nav: {
                    path: "@shopnex/sidebar-plugin/rsc#NavWithGroups",
                    clientProps: {
                        groupsConfig: pluginConfig.groups,
                    },
                },
            },
        };

        const onInit = config.onInit;
        config.onInit = async (payload) => {
            if (onInit) {
                await onInit(payload);
            }

            await config.custom?.syncPlugin?.(payload, {
                name: pkg.name,
                version: pkg.version,
                description: pkg.description,
                license: pkg.license,
                author: pkg.author,
                icon: pkg.icon,
                categories: pkg.category,
            });
        };

        return config;
    };
};

export default sidebarPlugin;
