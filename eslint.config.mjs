import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...compat.extends("plugin:@angular-eslint/recommended")
    .map(config => ({
      ...config,
      files: ["src/**/*.ts"],
    })),
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: ["tsconfig.*?.json"],
        createDefaultProgram: true,
      },
    },
    rules: {
      quotes: ["error", "single", {
        allowTemplateLiterals: true,
      }],
    },
  },
  ...compat.extends("plugin:@angular-eslint/template/recommended")
    .map(config => ({
      ...config,
      files: ["src/**/*.component.html"],
    })),
  {
    files: ["src/**/*.component.html"],
    rules: {
      "max-len": ["error", {
        code: 140,
      }],
    },
  },
  ...compat.extends("plugin:@angular-eslint/template/process-inline-templates")
    .map(config => ({
      ...config,
      files: ["src/**/*.component.ts"],
    }))
];
