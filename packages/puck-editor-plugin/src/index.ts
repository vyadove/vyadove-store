import type { Config } from "payload";
import pkg from "../package.json";
import { PuckPages } from "./collections/PuckPages";

type PuckEditorPluginConfig = {
    enabled?: boolean;
    collectionOverrides?: any;
};

export const puckEditorPlugin = (pluginConfig: PuckEditorPluginConfig = {}) => {
    return (config: Config): Config => {
        if (pluginConfig.enabled === false) {
            return config;
        }

        config.collections?.push(
            PuckPages({ overrides: pluginConfig.collectionOverrides })
        );

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

export default puckEditorPlugin;
