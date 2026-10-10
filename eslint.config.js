// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const nativeControlImports = [
  {
    name: 'react-native',
    importNames: [
      'Button',
      'Text',
      'TextInput',
      'Pressable',
      'TouchableOpacity',
      'TouchableHighlight',
      'TouchableWithoutFeedback',
      'ActivityIndicator',
      'ScrollView',
      'Switch',
      'Modal',
      'Image',
      'ImageBackground',
    ],
    message:
      'Render controls/content with Expo UI; RN is reserved for infrastructure. Use expo-image for native image content.',
  },
];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'Reference/**',
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
          paths: nativeControlImports,
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
    files: ['src/features/recipes/*screen*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: nativeControlImports,
          patterns: [
            {
              group: ['@storybook', '@storybook/*', 'storybook/*', '**/.rnstorybook/**'],
              message: 'Keep development tooling out of production screens.',
            },
            { group: ['@/app/**'], message: 'Import feature modules instead of route files.' },
            {
              group: [
                '@/services/api',
                './recipe.api',
                '@react-native-async-storage/async-storage',
                '@/services/auth/auth.session',
              ],
              message:
                'Screens compose feature queries/mutations; transport, storage and session writes belong in feature adapters.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: nativeControlImports,
          patterns: [
            {
              group: [
                '@/features/**',
                '@/app/**',
                '@/components/**',
                '@components/**',
                '@/context/**',
                '**/features/**',
                '**/components/**',
                '**/app/**',
              ],
              message: 'Infrastructure must not depend on screens or UI.',
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      'src/features/recipes/recipe-draft.ts',
      'src/features/recipes/chef-profile.ts',
      'src/features/recipes/query-keys.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react-native',
                'expo*',
                '@expo/**',
                '@tanstack/**',
                '@/services/**',
                '@/context/**',
                '@/components/**',
                '@components/**',
              ],
              message: 'Domain rules and cache identifiers stay independent of rendering and I/O.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: String.raw`ImportDeclaration[source.value=/^@expo\/ui(?:\/|$)/]`,
          message:
            'Import native UI from @components/ui. Buttons use UniversalButtonContent inside a Host or UniversalButton at an RN boundary, with an explicit variant.',
        },
        {
          selector: String.raw`ImportDeclaration[source.value=/^@\/components\//]`,
          message: 'Import shared presentation components from @components/ui.',
        },
        {
          selector: String.raw`ImportDeclaration[source.value=/^@components\/ui\//]`,
          message: 'Use the public @components/ui entry point for shared UI.',
        },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: nativeControlImports,
          patterns: [
            {
              group: ['@/features/**', '@/app/**', '@components/ui'],
              message:
                'UI implementations import siblings directly and stay independent of feature workflows and route modules.',
            },
            {
              group: ['@storybook', '@storybook/*', 'storybook/*', '**/.rnstorybook/**'],
              message: 'Keep development fixtures out of the shared UI library.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['.rnstorybook/stories/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { paths: nativeControlImports }] },
  },
  {
    files: ['*.config.js', 'scripts/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { __dirname: 'readonly' },
    },
  },
]);
