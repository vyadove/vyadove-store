import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginJest from "eslint-plugin-jest";
import tailwind from "eslint-plugin-tailwindcss";
import path from "node:path";
import ts from "typescript-eslint";
// import prettier from "prettier";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// import { nextJsConfig } from "@repo/eslint-config/next-js";
//
// /** @type {import("eslint").Linter.Config[]} */
// export default nextJsConfig;


export default [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:jest/recommended",
    // "prettier"
  ),
  eslintConfigPrettier,
  ...ts.configs.recommended,
  ...tailwind.configs["flat/recommended"],

  {
    plugins: { jest: pluginJest },

    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
      },
    },

    rules: {
      // C
      camelcase: "off",
      "capitalized-comments": "off",
      "default-param-last": "error",

      // E
      eqeqeq: "error",
      "max-params": ["warn", 3],

      // N
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-empty-function": "warn",
      "no-param-reassign": "error",

      // P
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
        {
          blankLine: "always",
          prev: "*",
          next: "function",
        },
        {
          blankLine: "always",
          prev: "*",
          next: "block-like",
        },
        {
          blankLine: "always",
          prev: ["import"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["import"],
          next: ["import"],
        },
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
      ],
      "prefer-const": "error",
      "prefer-destructuring": "error",
      "prefer-object-spread": "warn",

      "sort-keys": [
        "off",
        "asc",
        {
          natural: true,
          minKeys: 5,
        },
      ],
      "sort-vars": "error",
      "sort-imports": ["off"],

      //tailwind
      // "tailwindcss/classnames-order": "warn",
      "tailwindcss/enforces-negative-arbitrary-values": "warn",
      "tailwindcss/migration-from-tailwind-2": "warn",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-arbitrary-value": "off",

      // TypeScript:
      //   "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],

        // 1. Turn OFF the base ESLint rule
        'no-unused-vars': 'off',

        // 2. Configure the TypeScript-aware rule
        '@typescript-eslint/no-unused-vars': [
          'warn', // Set to 'error' to enforce it
          {
            argsIgnorePattern: '^_', // Ignore variables starting with an underscore (like _event)
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            ignoreRestSiblings: true, // Useful for object destructuring
          },
        ],

        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports", "disallowTypeAnnotations": false }],
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",


      // React
      "react/boolean-prop-naming": ["warn"],
      "react/jsx-newline": ["off"],
      "lint/style/useImportType": ["off"],
      "react/jsx-no-useless-fragment": [
        "error",
        {
          allowExpressions: true,
        },
      ],
      "react/jsx-sort-props": [
        "warn",
        {
          ignoreCase: true,
        },
      ],
    },
  },
];
