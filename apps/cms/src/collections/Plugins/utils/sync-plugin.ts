import { Payload } from "payload";

type PluginMeta = {
    name: string;
    version: string;
    author: string;
    icon: string;
    category: string;
    description: string;
    license: string;
};

export const syncPlugin = async (payload: Payload, pluginMeta: PluginMeta) => {
    const existing = await payload.find({
        collection: "plugins",
        where: {
            pluginId: {
                equals: pluginMeta.name,
            },
        },
        limit: 1,
    });

    if (existing.docs.length === 0) {
        const packageName = pluginMeta.name
            .split("/")[1] //
            .replace("-plugin", "")
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        await payload.create({
            collection: "plugins",
            data: {
                pluginId: pluginMeta.name,
                name: packageName,
                description: pluginMeta.description,
                author: pluginMeta.author,
                license: pluginMeta.license,
                svgIcon: pluginMeta.icon,
                category: pluginMeta.category,
                enabled: true,
            },
        });
    }
};
