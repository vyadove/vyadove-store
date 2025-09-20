import type { ProjectTemplate } from "../types.js";

import { error, info } from "../utils/log.js";

export function validateTemplate({
    templateName,
}: {
    templateName: string;
}): boolean {
    const validTemplates = getValidTemplates();
    if (!validTemplates.map((t) => t.name).includes(templateName)) {
        error(`'${templateName}' is not a valid template.`);
        info(
            `Valid templates: ${validTemplates.map((t) => t.name).join(", ")}`
        );
        return false;
    }
    return true;
}

export function getValidTemplates(): ProjectTemplate[] {
    // Starters _must_ be a valid template name from the templates/ directory
    return [
        {
            name: "simple-shop",
            type: "starter",
            description: "Simple E-commerce Store Template",
            url: `https://github.com/shopnex-ai/shopnex/templates/simple-shop#main`,
        },
    ];
}
