import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { createElement, useState } from 'react';
import ts from 'typescript';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';
import { createApiHarness, page } from '../helpers/api-harness.mjs';
import { entityFixture } from '../helpers/api-fixtures.mjs';

const { useTranslation } = createRequire(import.meta.url)('react-i18next');

const dictionaries = Object.fromEntries(
  ['fr', 'en', 'ar'].map((language) => [
    language,
    JSON.parse(readFileSync(new URL(`../../src/shared/locales/${language}.json`, import.meta.url))),
  ]),
);
function flatten(value, prefix = '') {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) =>
      typeof item === 'string'
        ? [[`${prefix}${key}`, item]]
        : Object.entries(flatten(item, `${prefix}${key}.`)),
    ),
  );
}
const flat = Object.fromEntries(
  Object.entries(dictionaries).map(([key, value]) => [key, flatten(value)]),
);

test('all dictionaries retain the reference keys and have matching nonempty translations and placeholders', () => {
  const keys = Object.keys(flat.en).sort();
  const placeholders = (text) =>
    [...text.matchAll(/\{\{([^}]+)\}\}/g)].map((match) => match[1]).sort();
  for (const language of ['fr', 'en', 'ar']) {
    assert.deepEqual(Object.keys(flat[language]).sort(), keys);
    const reference = flatten(
      JSON.parse(
        readFileSync(new URL(`../../reference/shared/locales/${language}.json`, import.meta.url)),
      ),
    );
    for (const [key, text] of Object.entries(reference))
      assert.equal(flat[language][key], text, key);
    for (const key of keys) {
      assert.ok(flat[language][key].trim(), `${language}: ${key}`);
      assert.deepEqual(
        placeholders(flat[language][key]),
        placeholders(flat.en[key]),
        `${language}: ${key}`,
      );
    }
  }
});

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = new URL(entry.name, directory);
    return entry.isDirectory()
      ? sourceFiles(new URL(`${entry.name}/`, directory))
      : /\.tsx?$/.test(entry.name)
        ? [file]
        : [];
  });
}
test('every literal translation key resolves in all languages; app UI has no hardcoded prose', () => {
  const labelProps = new Set([
    'label',
    'title',
    'description',
    'placeholder',
    'helperText',
    'accessibilityLabel',
    'supportingText',
    'trailing',
    'emptyMessage',
    'disabledMessage',
  ]);
  for (const file of sourceFiles(new URL('../../src/', import.meta.url))) {
    const source = ts.createSourceFile(
      file.pathname,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    function visit(node) {
      if (
        ts.isCallExpression(node) &&
        /^(t|i18n\.t)$/.test(node.expression.getText(source)) &&
        ts.isStringLiteral(node.arguments[0])
      ) {
        const key = node.arguments[0].text;
        for (const language of ['fr', 'en', 'ar'])
          assert.ok(flat[language][key], `${file.pathname}: ${key}`);
      }
      if (ts.isJsxText(node))
        assert.equal(/[A-Za-z]/.test(node.text), false, `${file.pathname}: ${node.text.trim()}`);
      if (
        ts.isStringLiteral(node) &&
        ts.isJsxAttribute(node.parent) &&
        labelProps.has(node.parent.name.getText(source))
      )
        assert.equal(
          /[A-Za-z]/.test(node.text),
          false,
          `${file.pathname}: ${node.parent.getText(source)}`,
        );
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
});

function setup(storage) {
  const native = (type) =>
    function NativeFixture(props) {
      return createElement(type, props, props.children);
    };
  const Picker = native('Picker');
  Picker.Item = native('PickerItem');
  const writes = [];
  const load = createSourceLoader({
    '@react-native-async-storage/async-storage': {
      getItem: storage.getItem ?? (async () => storage.value ?? null),
      setItem: async (key, value) => {
        writes.push([key, value]);
        await storage.setItem?.(key, value);
        storage.value = value;
      },
    },
    'react-native': { View: native('View'), I18nManager: { isRTL: false } },
    'expo-router': { LocaleProvider: native('LocaleProvider') },
    '@/components/ui/picker': { Picker },
  });
  const {
    default: i18n,
    translateValidationMessage,
    normalizeLanguage,
    getCurrentLanguage,
  } = load('lib/i18n.ts');
  void i18n.changeLanguage('fr');
  const { LanguageProvider, useLanguage } = load('context/language.context.tsx');
  const { LayoutDirectionProvider, useLayoutDirection } = load(
    'context/layout-direction.context.tsx',
  );
  const { LanguagePicker } = load('components/ui/language-picker.tsx');
  let settings;
  function Content() {
    settings = useLanguage();
    const { t } = useTranslation();
    const direction = useLayoutDirection();
    const [draft, setDraft] = useState('');
    return createElement(
      'Content',
      {
        ...settings,
        direction,
        draft,
        setDraft,
        title: t('common.home'),
        validation: translateValidationMessage('auth.passwordMismatch'),
        countdown: t('auth.resendCountdown', { seconds: 12 }),
      },
      createElement(LanguagePicker),
    );
  }
  const view = renderFixture(
    createElement(
      LayoutDirectionProvider,
      null,
      createElement(LanguageProvider, null, createElement(Content)),
    ),
  );
  const flushAsync = async () => {
    await new Promise(setImmediate);
    view.flush(() => {});
  };
  return {
    view,
    writes,
    flushAsync,
    i18n,
    normalizeLanguage,
    getCurrentLanguage,
    settings: () => settings,
    content: () => view.findAll('Content')[0].props,
    picker: () => view.findAll('Picker')[0].props,
  };
}

test('saved Arabic restores before readiness; switching all languages retains the draft and updates RTL and feedback', async () => {
  const s = setup({ value: 'ar-MA' });
  try {
    assert.equal(s.content().ready, false);
    assert.equal(s.picker().enabled, false);
    await s.flushAsync();
    assert.equal(s.content().ready, true);
    assert.equal(s.content().language, 'ar');
    assert.equal(s.content().direction, 'rtl');
    assert.deepEqual(
      s.view.findAll('PickerItem').map((item) => item.props.label),
      ['Français', 'English', 'العربية'],
    );
    const original = s.view.findAll('Content')[0];
    s.view.flush(() => s.content().setDraft('مسودة Draft 123'));
    for (const language of ['fr', 'en', 'ar']) {
      s.view.flush(() => s.picker().onValueChange(language));
      assert.equal(s.view.findAll('Content')[0], original);
      assert.equal(s.content().draft, 'مسودة Draft 123');
      assert.equal(s.content().title, dictionaries[language].common.home);
      assert.equal(s.content().validation, dictionaries[language].auth.passwordMismatch);
      assert.equal(
        s.content().countdown,
        dictionaries[language].auth.resendCountdown.replace('{{seconds}}', '12'),
      );
      assert.equal(s.content().direction, language === 'ar' ? 'rtl' : 'ltr');
    }
    await s.flushAsync();
    assert.deepEqual(s.writes, [
      ['appLanguage', 'fr'],
      ['appLanguage', 'en'],
      ['appLanguage', 'ar'],
    ]);
  } finally {
    s.view.unmount();
  }
});

test('unsupported preferences and unavailable storage leave startup usable in French', async () => {
  for (const storage of [
    { value: 'de' },
    {
      getItem: async () => {
        throw new Error('Unavailable');
      },
      setItem: async () => {
        throw new Error('Unavailable');
      },
    },
  ]) {
    const s = setup(storage);
    try {
      await s.flushAsync();
      assert.equal(s.content().ready, true);
      assert.equal(s.content().language, 'fr');
      assert.equal(s.content().direction, 'ltr');
      s.view.flush(() => s.picker().onValueChange('ar'));
      await s.flushAsync();
      assert.equal(s.content().language, 'ar');
      assert.equal(s.content().direction, 'rtl');
    } finally {
      s.view.unmount();
    }
  }
});

test('rapid selection writes in order and the most recent choice restores on the next launch', async () => {
  let finishWrite;
  const firstWrite = new Promise((resolve) => {
    finishWrite = resolve;
  });
  const storage = {
    value: 'fr',
    setItem: async (_key, value) => {
      if (value === 'ar') await firstWrite;
    },
  };
  const s = setup(storage);
  await s.flushAsync();
  s.view.flush(() => s.picker().onValueChange('ar'));
  s.view.flush(() => s.picker().onValueChange('en'));
  await s.flushAsync();
  assert.deepEqual(s.writes, [['appLanguage', 'ar']]);
  assert.equal(s.content().language, 'en');
  finishWrite();
  await s.flushAsync();
  assert.deepEqual(s.writes, [
    ['appLanguage', 'ar'],
    ['appLanguage', 'en'],
  ]);
  s.view.unmount();
  const restored = setup(storage);
  try {
    await restored.flushAsync();
    assert.equal(restored.content().language, 'en');
    assert.equal(restored.content().direction, 'ltr');
  } finally {
    restored.view.unmount();
  }
});

test('a storage read completing after unmount cannot change the active language', async () => {
  let finishRead;
  const stored = new Promise((resolve) => {
    finishRead = resolve;
  });
  const s = setup({ getItem: () => stored });
  s.view.unmount();
  await s.i18n.changeLanguage('en');
  finishRead('ar');
  await new Promise(setImmediate);
  assert.equal(s.getCurrentLanguage(), 'en');
  assert.equal(s.normalizeLanguage(' FR_ca '), 'fr');
  assert.equal(s.normalizeLanguage('unsupported'), null);
});

test('API requests follow the selected language and friendly failures use the current dictionary', async () => {
  const s = createApiHarness(() => page([entityFixture('recipe')]));
  const i18n = s.load('lib/i18n.ts').default;
  const { ApiError } = s.load('services/api.error.ts');
  const { getAuthErrorMessage } = s.load('services/auth/auth.service.ts');
  const service = s.load('services/recipe/recipe.service.ts').recipeService;
  try {
    for (const language of ['fr', 'en', 'ar']) {
      await i18n.changeLanguage(language);
      await service.list();
      assert.equal(s.requests.at(-1).headers.get('Accept-Language'), language);
      assert.equal(
        getAuthErrorMessage(
          new ApiError('401', 401, { code: 'INVALID_CREDENTIALS' }, 'Unauthorized'),
        ),
        dictionaries[language].auth.invalidCredentials,
      );
      assert.equal(
        getAuthErrorMessage(new ApiError('503', 503, null, 'Unavailable')),
        dictionaries[language].auth.temporaryFailure,
      );
      assert.equal(
        getAuthErrorMessage(new ApiError('422', 422, null, 'api.invalidData')),
        dictionaries[language].api.invalidData,
      );
      assert.equal(
        getAuthErrorMessage(new Error('Internal diagnostic')),
        dictionaries[language].auth.requestFailed,
      );
    }
  } finally {
    s.client.clear();
  }
});
