module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "plugin:vue/vue3-recommended",
        "standard",
    ],
    parserOptions: {
        ecmaVersion: 12,
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: [
        "vue",
        "@typescript-eslint",
    ],
    rules: {
        "no-unused-vars": ["warn", {
            vars: "all",
            args: "after-used",
            ignoreRestSiblings: false,
        }],
        "comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "never",
            exports: "ignore",
            functions: "never",
        }],
        indent: ["error", 4],
        eqeqeq: "error",
        "space-before-function-paren": ["error", "never"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "vue/html-indent": ["warn", 4],
        "object-property-newline": [
            "warn",
            {
                allowAllPropertiesOnSameLine: false,
            },
        ],
    },
}
