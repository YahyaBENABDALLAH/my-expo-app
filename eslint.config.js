// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/**',
      'android/**',
      'ios/**',
      '.expo/**',
      '.maestro/results/**',
      '.rnstorybook/storybook.requires.ts',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/features/storybook/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@storybook', '@storybook/*', 'storybook/*', '**/.rnstorybook/**'],
              message: 'Keep Storybook imports in src/features/storybook and .rnstorybook.',
            },
            {
              group: ['@/app/*'],
              message: 'Import feature modules instead of route files.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['*.config.js', 'scripts/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { __dirname: 'readonly' },
    },
  },
]);
