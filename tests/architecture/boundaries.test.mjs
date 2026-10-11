import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const eslint = new ESLint({ cwd: fileURLToPath(new URL('../../', import.meta.url)) });
async function messages(filePath, source) {
  const [result] = await eslint.lintText(source, { filePath });
  assert.equal(result.fatalErrorCount, 0, JSON.stringify(result.messages));
  return result.messages;
}

for (const file of [
  'src/features/recipes/home-screen.tsx',
  'src/services/recipe/recipe.service.ts',
  'src/services/recipe/recipe.queries.ts',
  'src/features/recipes/recipe-draft.ts',
  'src/components/ui/loading/query-content.tsx',
]) {
  test(`${file}: scoped overrides retain production boundaries`, async () => {
    for (const source of [
      "import '@storybook/react-native';",
      "export * from '@/app/(tabs)/index';",
      "import '../../../.rnstorybook/index';",
    ]) {
      assert.ok(
        (await messages(file, source)).some(
          (message) => message.ruleId === 'no-restricted-imports',
        ),
        source,
      );
    }
  });
}

for (const [file, source] of [
  ['src/features/recipes/home-screen.tsx', "import '@/services/api';"],
  ['src/features/recipes/home-screen.tsx', "import '../../services/api';"],
  ['src/features/recipes/home-screen.tsx', "import '../ui-showcase/home-card-examples';"],
  ['src/services/recipe/recipe.service.ts', "import '@tanstack/react-query';"],
  ['src/services/recipe/recipe.service.ts', "import '../../features/recipes/home-screen';"],
  ['src/features/recipes/recipe-draft.ts', "import '@react-native-async-storage/async-storage';"],
  ['src/components/ui/loading/query-content.tsx', "import '../../../features/recipes/queries';"],
]) {
  test(`${file}: rejects ${source}`, async () => {
    assert.ok(
      (await messages(file, source)).some((message) => message.ruleId === 'no-restricted-imports'),
    );
  });
}

test('feature screens use the shared native UI entry point', async () => {
  for (const source of ["import '@expo/ui';", "import '@components/ui/button/universal-button';"]) {
    assert.ok(
      (await messages('src/features/recipes/home-screen.tsx', source)).some(
        (message) => message.ruleId === 'no-restricted-syntax',
      ),
    );
  }
  const allowed = await messages(
    'src/features/recipes/home-screen.tsx',
    "import '@components/ui'; import './queries';",
  );
  assert.equal(
    allowed.some((message) => message.ruleId?.startsWith('no-restricted-')),
    false,
  );
});

test('Storybook integration and colocated UI implementation imports stay allowed', async () => {
  for (const [file, source] of [
    ['src/features/storybook/storybook-screen.tsx', "import '@storybook/react-native';"],
    ['src/components/ui/loading/query-content.tsx', "import '../text/universal-text';"],
    ['src/services/recipe/recipe.service.ts', "import '../api';"],
  ]) {
    assert.equal(
      (await messages(file, source)).some((message) =>
        message.ruleId?.startsWith('no-restricted-'),
      ),
      false,
    );
  }
});
