module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "lit", "prettier"],
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:wc/recommended",
    "plugin:lit/recommended",
    "prettier",
  ],
  rules: {
    semi: 2,
    "prettier/prettier": 2,
  },
};
