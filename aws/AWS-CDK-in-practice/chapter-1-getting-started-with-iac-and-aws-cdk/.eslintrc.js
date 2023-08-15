module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'chai-friendly', 'no-only-tests'],
  extends: [
    // 'react-app', // error: ESLint couldn't determine the plugin "@typescript-eslint" uniquely.
    'react-app/jest',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-only-tests/no-only-tests': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'testing-library/no-render-in-setup': 'off',
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
}
