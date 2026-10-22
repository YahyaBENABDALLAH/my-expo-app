// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');
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

// Flat-config rule options replace one another. Every scoped import policy must
// include these shared boundaries so a later override cannot reopen them.
const sharedImportPatterns = [
  {
    group: ['@storybook', '@storybook/*', 'storybook/*', '**/.rnstorybook', '**/.rnstorybook/**'],
    message: 'Keep Storybook imports in src/features/storybook and .rnstorybook.',
  },
  {
    group: ['@/app/**', '**/app/**'],
    message: 'Import feature modules instead of route files.',
  },
];

function restrictImports(patterns = []) {
  return [
    'error',
    { paths: nativeControlImports, patterns: [...sharedImportPatterns, ...patterns] },
  ];
}

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'Reference/**',
      'dist/**',
      'android/**',
      'ios/**',
      '.expo/**',
      '.scannerwork/**',
      '.sonarqube-local/**',
      '.rnstorybook/storybook.requires.ts',
      '.husky/_/**',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/features/storybook/**'],
    rules: { 'no-restricted-imports': restrictImports() },
  },
  {
    files: ['src/features/recipes/*screen*.tsx'],
    rules: {
      'no-restricted-imports': restrictImports([
        {
          group: [
            '@/services/api',
            '**/services/api',
            './recipe.api',
            '@react-native-async-storage/async-storage',
            '@/services/auth/auth.session',
            '**/services/auth/auth.session',
          ],
          message:
            'Screens compose feature queries/mutations; transport, storage and session writes belong in feature adapters.',
        },
        {
          group: ['@/features/ui-showcase/**', '**/ui-showcase/**'],
          message: 'Keep sample content in the UI showcase; product screens render real data.',
        },
      ]),
    },
  },
  {
    files: ['src/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports([
        {
          group: [
            '@/features/**',
            '@/components/**',
            '@components/**',
            '@/context/**',
            '**/features/**',
            '**/components/**',
            '**/context/**',
          ],
          message: 'Infrastructure must not depend on screens or UI.',
        },
      ]),
    },
  },
  {
    files: ['src/services/**/*.service.ts'],
    rules: {
      'no-restricted-imports': restrictImports([
        {
          group: [
            'react',
            '@tanstack/**',
            'expo-router',
            '@/features/**',
            '@/components/**',
            '@components/**',
            '@/context/**',
            '**/features/**',
            '**/components/**',
            '**/context/**',
          ],
          message:
            'Entity services own transport contracts; rendering and cache effects belong in consumers and query/mutation modules.',
        },
      ]),
    },
  },
  {
    files: [
      'src/features/recipes/recipe-draft.ts',
      'src/features/recipes/chef-profile.ts',
      'src/features/recipes/query-keys.ts',
    ],
    rules: {
      'no-restricted-imports': restrictImports([
        {
          group: [
            'react',
            'react-native',
            'expo*',
            '@expo/**',
            '@tanstack/**',
            '@react-native-async-storage/**',
            '@/services/**',
            '@/context/**',
            '@/components/**',
            '@components/**',
            '**/services/**',
            '**/context/**',
            '**/components/**',
          ],
          message: 'Domain rules and cache identifiers stay independent of rendering and I/O.',
        },
      ]),
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
      'no-restricted-imports': restrictImports([
        {
          group: ['@/features/**', '**/features/**', '@components/ui'],
          message:
            'UI implementations import siblings directly and stay independent of feature workflows and route modules.',
        },
      ]),
    },
  },
  {
    files: ['.rnstorybook/stories/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { paths: nativeControlImports }] },
  },
  {
    files: ['*.config.js', 'scripts/**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { __dirname: 'readonly' } },
  },
  prettierConfig,
]);
