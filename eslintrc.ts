module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [
          ".js",
          ".ts",
          ".tsx",
        ],
      },
    },
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "prefer-destructuring": 0,
    "no-param-reassign": 0,
    "import/extensions": 0,
    "dot-notation": 0,
    "no-continue": 0,
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  },
};
