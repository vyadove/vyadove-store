/* eslint-disable no-console */
import chalk from "chalk";
import path from "path";
import terminalLink from "terminal-link";

import type { PackageManager, ProjectTemplate } from "../types.js";

import { getValidTemplates } from "../lib/templates.js";

const header = (message: string): string => chalk.bold(message);

export const welcomeMessage = chalk`
  {green Welcome to ShopNex. Let's create your e-commerce store! }
`;

const spacer = " ".repeat(8);

export function helpMessage(): void {
    const validTemplates = getValidTemplates();
    console.log(chalk`
  {bold USAGE}

      {dim Inside of an existing Next.js project}

      {dim $} {bold npx create-shopnex-app}

      {dim Create a new project from scratch}

      {dim $} {bold npx create-shopnex-app}
      {dim $} {bold npx create-shopnex-app} my-project
      {dim $} {bold npx create-shopnex-app} -n my-project -t template-name

  {bold OPTIONS}

      -n     {underline my-shopnex-app}         Set project name
      -t     {underline template_name}          Choose specific template
      -e     {underline example_name}           Choose specific example

        {dim Available templates: ${formatTemplates(validTemplates)}}

      --use-npm                     Use npm to install dependencies
      --use-yarn                    Use yarn to install dependencies
      --use-pnpm                    Use pnpm to install dependencies
      --use-bun                     Use bun to install dependencies (experimental)
      --no-deps                     Do not install any dependencies
      -h                            Show help
`);
}

function formatTemplates(templates: ProjectTemplate[]) {
    return `\n\n${spacer}${templates
        .map(
            (t) => `${t.name}${" ".repeat(28 - t.name.length)}${t.description}`
        )
        .join(`\n${spacer}`)}`;
}

export function successMessage(
    projectDir: string,
    packageManager: PackageManager
): string {
    const relativePath = path.relative(process.cwd(), projectDir);
    return `
${header("Launch Your E-commerce Store:")}

  - cd ./${relativePath}
  - ${packageManager === "npm" ? "npm run" : packageManager} dev or follow directions in README.md

${header("Documentation:")}

  - ${createTerminalLink(
      "Getting Started",
      "https://shopnex.ai/docs"
  )}
  - ${createTerminalLink("E-commerce Configuration", "https://shopnex.ai/docs/config")}

`;
}

export function successfulNextInit(): string {
    return `- ${createTerminalLink(
        "Getting Started",
        "https://shopnex.ai/docs"
    )}
- ${createTerminalLink("E-commerce Configuration", "https://shopnex.ai/docs/config")}
`;
}

export function moveMessage(args: {
    nextAppDir: string;
    projectDir: string;
}): string {
    const relativeAppDir = path.relative(process.cwd(), args.nextAppDir);
    return `
${header("Next Steps:")}

Payload does not support a top-level layout.tsx file in the app directory.

${chalk.bold("To continue:")}

- Create a new directory in ./${relativeAppDir} such as ./${relativeAppDir}/${chalk.bold("(app)")}
- Move all files from ./${relativeAppDir} into that directory

It is recommended to do this from your IDE if your app has existing file references.

Once moved, rerun the create-shopnex-app command again.
`;
}

export function feedbackOutro(): string {
    return `${chalk.bgCyan(chalk.black(" Have feedback? "))} Visit us on ${createTerminalLink("GitHub", "https://github.com/shopnex-ai/shopnex")}.`;
}

// Create terminalLink with fallback for unsupported terminals
function createTerminalLink(text: string, url: string) {
    return terminalLink(text, url, {
        fallback: (text, url) => `${text}: ${url}`,
    });
}
