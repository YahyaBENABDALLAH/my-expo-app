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
    group: ['@/app/**', '**/app/**'],
    message: 'Import feature modules instead of route files.',
  },
];
const storybookImportPatterns = [
  {
    regex: '^(?:@storybook(?:/|$)|storybook(?:/|$))|(?:^|/)\\.rnstorybook(?:/|$)',
    message: 'Keep Storybook imports in src/features/storybook and .rnstorybook.',
  },
];
const serviceImportPatterns = [
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
    message: 'Services must not depend on feature presentation or UI contexts.',
  },
];
const cacheImportPatterns = [
  {
    regex:
      '(^|/)(?:react-query|query-(?:utils|hooks|invalidation|refresh)|[^/]+\\.(?:queries|mutations|hooks))(?:\\.[cm]?[jt]sx?)?$',
    message: 'Query/cache effects belong in query/mutation modules and their consumers.',
  },
];
const transportImportPatterns = [
  ...serviceImportPatterns,
  ...cacheImportPatterns,
  {
    group: [
      'react',
      'react/**',
      'react-native',
      'react-native/**',
      'expo*',
      '@expo/**',
      '@tanstack/**',
    ],
    message:
      'Entity transport owns HTTP contracts; React, navigation and cache effects belong in consumers or query/mutation modules.',
  },
];
const screenFiles = [
  'src/app/**/*.{ts,tsx}',
  'src/features/**/*screen*.{ts,tsx}',
  'src/features/**/screens/**/*.{ts,tsx}',
];

function restrictImports(patterns = [], { allowStorybook = false } = {}) {
  return [
    'error',
    {
      paths: nativeControlImports,
      patterns: [
        ...sharedImportPatterns,
        ...(allowStorybook ? [] : storybookImportPatterns),
        ...patterns,
      ],
    },
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
    rules: { 'no-restricted-imports': restrictImports() },
  },
  {
    files: ['src/features/storybook/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': restrictImports([], { allowStorybook: true }) },
  },
  {
    files: screenFiles,
    // These entry points intentionally compose the developer catalog/fixtures.
    ignores: [
      'src/app/ui.tsx',
      'src/app/ui-component/**',
      'src/app/storybook.tsx',
      'src/features/ui-showcase/**',
      'src/features/pages/screens.tsx',
      'src/features/storybook/**',
    ],
    rules: {
      'no-restricted-imports': restrictImports([
        {
          regex:
            '(^|/)(?:services/(?:api|api\\.config|request-utils)|auth\\.session)(?:\\.[cm]?[jt]sx?)?$',
          message:
            'Screens consume endpoint functions and feature workflows; low-level HTTP configuration and session storage belong in their existing owners.',
        },
        {
          group: ['axios', 'axios/**', 'expo-secure-store', '@react-native-async-storage/**'],
          message:
            'Screens do not own HTTP clients or persisted storage. Use the existing workflow or preference owner.',
        },
        {
          group: [
            '@/features/ui-showcase/**',
            '**/ui-showcase/**',
            '@/features/storybook/**',
            '**/features/storybook/**',
          ],
          message:
            'Keep developer examples in their catalog/Storybook entries; product screens render real data.',
        },
      ]),
    },
  },
  {
    files: ['src/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports(serviceImportPatterns),
    },
  },
  {
    files: ['src/services/**/*.{service,api}.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports(transportImportPatterns),
    },
  },
  {
    files: ['src/services/auth/auth.refresh.ts'],
    rules: {
      'no-restricted-imports': restrictImports([
        ...serviceImportPatterns,
        {
          regex: '(^|/)(?:api|auth\\.api|auth\\.lifecycle)(?:\\.[cm]?[jt]sx?)?$',
          message:
            'Refresh must keep its raw transport independent of the authenticated client, auth endpoints and lifecycle to avoid interceptor cycles.',
        },
      ]),
    },
  },
  {
    files: [
      'src/validation/schemas/**/*.{ts,tsx}',
      'src/types/**/*.{ts,tsx}',
      'src/**/*.mapper.{ts,tsx}',
      'src/lib/api-query-keys.ts',
      'src/config/developer-tools.ts',
    ],
    rules: {
      'no-restricted-imports': restrictImports([
        ...cacheImportPatterns,
        {
          regex:
            '(^|/)(?:api|api\\.config|auth\\.(?:session|refresh|lifecycle)|device-installation|[^/]+\\.(?:api|service))(?:\\.[cm]?[jt]sx?)?$',
          message:
            'Pure modules must not import transport, native storage or auth lifecycle owners.',
        },
        {
          regex:
            '(^|/)(?:lib/(?:i18n|alerts|error-alerts)|config/(?:brand|brand-assets))(?:\\.[cm]?[jt]sx?)?$',
          message:
            'Pure modules must not import native brand accessors, initialized translation or feedback state.',
        },
        {
          group: [
            'react',
            'react/**',
            'react-i18next',
            'react-hook-form',
            'react-native',
            'react-native/**',
            'expo*',
            '@expo/**',
            '@tanstack/**',
            '@react-native*/**',
            'axios',
            'axios/**',
            'node:*',
            'fs',
            'fs/**',
            '@/services/**',
            '@/features/**',
            '@/hooks/**',
            '@/context/**',
            '@/components/**',
            '@components/**',
            '**/services/**',
            '**/features/**',
            '**/hooks/**',
            '**/context/**',
            '**/components/**',
          ],
          message:
            'Schemas, DTOs, mappers and pure configuration stay independent of rendering, query caches and I/O.',
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
          group: [
            '@/features/**',
            '**/features/**',
            '@components/ui',
            '@/services/**',
            '**/services/**',
            'axios',
            'axios/**',
            'expo-secure-store',
            '@react-native-async-storage/**',
          ],
          message:
            'UI implementations import siblings directly and receive workflow/data callbacks; keep feature orchestration, transport and storage outside shared UI.',
        },
      ]),
    },
  },
  {
    files: ['.rnstorybook/stories/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { paths: nativeControlImports }] },
  },
  {
    files: ['*.config.js', 'config/**/*.js', 'scripts/**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: { __dirname: 'readonly' } },
  },
  prettierConfig,
]);
