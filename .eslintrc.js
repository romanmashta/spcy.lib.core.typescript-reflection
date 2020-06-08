module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  extends: ["airbnb-typescript-prettier"],
  "env": {
    "jest": true
  },
  ignorePatterns: ["dist", "*.config.js", ".*.js"],
};
