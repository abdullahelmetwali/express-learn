import { defineConfig } from "eslint/config";

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        ...js.configs.recommended,
        languageOptions: {
            ...js.configs.recommended.languageOptions,
            globals: { ...globals.browser, ...globals.node },
        },
    },
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        ...tseslint.configs.recommended,
        languageOptions: {
            ...tseslint.configs.recommended.languageOptions,
            globals: { ...globals.browser, ...globals.node },
            parserOptions: {
                ...tseslint.configs.recommended.languageOptions.parserOptions,
                project: false,
            },
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    },
]);

