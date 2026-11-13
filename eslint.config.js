import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default tseslint.config(
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  { ignores: ['dist', 'vendor', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'error',
      eqeqeq: 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: { ...globals.node } } },
  // Tests may assert that fixtures exist.
  { files: ['tests/**'], rules: { '@typescript-eslint/no-non-null-assertion': 'off' } },
);
