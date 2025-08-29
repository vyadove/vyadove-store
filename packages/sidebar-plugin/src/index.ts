import type { Config } from "payload";
import pkg from "../package.json";
import { getNavIcon } from "./components/Nav/get-nav-icon";
import { ExoticComponent } from "react";
import { LucideProps } from "lucide-react";

type EmailChannelPluginConfig = {
    enabled?: boolean;
};

export const sidebarPlugin = (pluginConfig: EmailChannelPluginConfig = {}) => {
    return (config: Config): Config => {
        if (pluginConfig.enabled === false) {
            return config;
        }

        config.admin = {
            ...(config.admin ?? {}),
            components: {
                ...(config.admin?.components ?? {}),
                Nav: {
                    path: "@shopnex/sidebar-plugin/rsc#Nav",
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
                category: pkg.category,
            });
        };

        return config;
    };
};

export default sidebarPlugin;
