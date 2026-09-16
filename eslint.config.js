import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      sourceType: 'module',
    },
    plugins: { ...reactHooks.configs.flat.recommended.plugins, ...reactRefresh.configs.vite.plugins },
    rules: { ...reactHooks.configs.flat.recommended.rules, ...reactRefresh.configs.vite.rules },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', globals: globals.node, sourceType: 'module' },
  },
];
