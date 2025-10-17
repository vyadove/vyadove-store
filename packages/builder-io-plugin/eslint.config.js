import { rootEslintConfig, rootParserOptions } from "../../__eslint.config.js";

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config[]} */
export const index = [
    ...rootEslintConfig,
    {
        languageOptions: {
            parserOptions: {
                ...rootParserOptions,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
];

export default index;
