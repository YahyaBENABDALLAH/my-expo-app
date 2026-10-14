import assert from 'node:assert/strict';
import test from 'node:test';
import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { renderFixture } from '../helpers/render-fixture.mjs';

for (const platform of ['ios', 'android']) {
  for (const initialScheme of ['light', 'dark']) {
    test(`${platform}/${initialScheme}: Login corner controls change appearance and language without remounting drafts`, async () => {
      const native = (type) =>
        function NativeFixture(props) {
          return createElement(type, props, props.children);
        };
      const Icon = native('Icon');
      Icon.select = (spec) => spec[platform];
      const safeArea = createContext({ top: 59, bottom: 34, left: 10, right: 18 });
      const writes = [];
      const mocks = {
        '@react-native-async-storage/async-storage': {
          getItem: async () => 'fr',
          setItem: async (key, value) => writes.push([key, value]),
        },
        'react-native': {
          View: native('View'),
          KeyboardAvoidingView: native('KeyboardAvoidingView'),
          I18nManager: { isRTL: false },
          Platform: { OS: platform },
          useColorScheme: () => initialScheme,
          useWindowDimensions: () => ({ width: 390, height: 844 }),
        },
        'expo-router': { LocaleProvider: native('LocaleProvider') },
        'react-native-safe-area-context': {
          SafeAreaInsetsContext: safeArea,
          useSafeAreaInsets: () => useContext(safeArea),
        },
        '@expo/ui': {
          Host: native('Host'),
          Column: native('Column'),
          Row: native('Row'),
          Spacer: native('Spacer'),
          Icon,
          Text: native('Text'),
          RNHostView: native('RNHostView'),
          BottomSheet: (props) =>
            createElement('Sheet', props, props.isPresented ? props.children : null),
        },
        '@expo/ui/swift-ui': { Button: native('IconButton') },
        '@expo/ui/swift-ui/modifiers': {
          accessibilityLabel: (label) => ({ label }),
          buttonStyle: (style) => ({ buttonStyle: style }),
          contentShape: (shape) => ({ shape }),
          disabled: (disabled) => ({ disabled }),
          frame: (frame) => ({ frame }),
          presentationCornerRadius: (value) => ({ presentationCornerRadius: value }),
          onGeometryChange: (handler) => ({ onGeometryChange: handler }),
          shapes: { rectangle: () => 'rectangle' },
        },
        '@expo/ui/jetpack-compose': { IconButton: native('IconButton') },
        '@expo/ui/jetpack-compose/modifiers': {
          onSizeChanged: (handler) => ({ onSizeChanged: handler }),
          semantics: (semantics) => ({ semantics }),
          size: (width, height) => ({ width, height }),
          testID: (testID) => ({ testID }),
        },
        '@expo/material-symbols/language.xml': 'language',
        '@expo/material-symbols/light_mode.xml': 'sun',
        '@expo/material-symbols/dark_mode.xml': 'moon',
        '@/components/ui/native/native-fill-width': {
          nativeFillWidth: [],
          nativeFillWidthCenter: [],
          nativeRowWeight: [],
        },
        '@/components/ui/page/page-back-button': { PageBackButton: native('BackButton') },
        '@/components/ui/refreshable-scroll-view/refreshable-scroll-view': {
          RefreshableScrollView: native('ScrollView'),
        },
        '@/components/ui/button/universal-button-content': {
          UniversalButtonContent: native('Button'),
        },
      };
      const load = createSourceLoader(mocks);
      mocks['@/components/ui/auth/auth-icon-button'] = load(
        `components/ui/auth/auth-icon-button.${platform}.tsx`,
      );
      const { LoginPreferences } = load('components/ui/auth/login-preferences.tsx');
      const { AuthScreenFrame } = load('components/ui/auth/auth-screen-frame.tsx');
      const { LayoutDirectionProvider, useLayoutDirection } = load(
        'context/layout-direction.context.tsx',
      );
      const { LanguageProvider, useLanguage } = load('context/language.context.tsx');
      const { ThemePreferencesProvider } = load('context/theme.context.tsx');
      const { useColorScheme } = load('hooks/use-color-scheme.ts');
      const { default: i18n } = load('lib/i18n.ts');
      let edit;
      let mounts = 0;
      function LoginDraft() {
        const { language } = useLanguage();
        const t = i18n.getFixedT(language);
        const direction = useLayoutDirection();
        const scheme = useColorScheme();
        const [draft, setDraft] = useState({ login: '', password: '' });
        edit = setDraft;
        useEffect(() => {
          mounts++;
        }, []);
        return createElement(
          AuthScreenFrame,
          {
            testID: 'auth-login',
            title: t('auth.welcomeBack'),
            description: t('auth.loginDescription'),
            topBar: createElement(LoginPreferences),
          },
          createElement('Draft', { draft, language, direction, scheme }),
        );
      }
      const view = renderFixture(
        createElement(
          LayoutDirectionProvider,
          null,
          createElement(
            LanguageProvider,
            null,
            createElement(
              ThemePreferencesProvider,
              { initialColorScheme: initialScheme },
              createElement(LoginDraft),
            ),
          ),
        ),
      );
      const flushAsync = async () => {
        await new Promise(setImmediate);
        view.flush(() => {});
      };
      const iconButton = (id) =>
        view
          .findAll('IconButton')
          .find(({ props }) =>
            platform === 'ios'
              ? props.testID === id
              : props.modifiers.some((modifier) => modifier.testID === id),
          );
      const press = (button) =>
        view.flush(() => (platform === 'ios' ? button.props.onPress : button.props.onClick)());
      const contains = (root, node) =>
        root === node || root.children.some((child) => contains(child, node));
      const languageButton = iconButton('auth-login-language');
      try {
        assert.equal(
          platform === 'ios' ? languageButton.props.onPress : languageButton.props.onClick,
          undefined,
          'Language selection waits for restored preferences.',
        );
        await flushAsync();
        const draft = view.findAll('Draft')[0];
        const topBar = view
          .findAll('Host')
          .find(({ props }) => props.testID === 'auth-login-preferences');
        const scroll = view.findAll('ScrollView')[0];
        assert.equal(topBar.props.layoutDirection, 'leftToRight');
        assert.equal(contains(scroll, topBar), false);
        assert.deepEqual(
          topBar.children[0].children.map(({ type }) => type),
          ['IconButton', 'Spacer', 'IconButton'],
        );
        assert.equal(topBar.children[0].props.style.paddingLeft, 26);
        assert.equal(topBar.children[0].props.style.paddingRight, 34);
        view.flush(() => edit({ login: 'draft@example.com', password: 'secret draft' }));
        press(iconButton('auth-login-color-scheme'));
        const toggled = initialScheme === 'light' ? 'dark' : 'light';
        assert.equal(draft.props.scheme, toggled);
        assert.equal(
          iconButton('auth-login-color-scheme').children[0].props.name,
          platform === 'ios'
            ? toggled === 'dark'
              ? 'sun.max'
              : 'moon'
            : toggled === 'dark'
              ? 'sun'
              : 'moon',
        );
        for (const language of ['en', 'ar', 'fr']) {
          press(languageButton);
          const sheet = view.findAll('Sheet')[0];
          assert.equal(sheet.props.isPresented, true);
          for (const prop of [
            'containerColor',
            'contentColor',
            'contentPadding',
            'modifiers',
            'snapPoints',
          ]) {
            assert.equal(sheet.props[prop], undefined, `${prop} keeps Expo UI's native default.`);
          }
          assert.equal(sheet.props.showDragIndicator, platform === 'ios' ? false : undefined);
          assert.equal(
            view.findAll('Column').some(({ props }) => props.style?.height === 4),
            false,
            'The language sheet uses the system handle.',
          );
          const options = view
            .findAll('Button')
            .filter(({ props }) => /^auth-login-language-(fr|en|ar)$/.test(props.testID));
          assert.deepEqual(
            options.map(({ props }) => props.label),
            ['Français', 'English', 'العربية'],
          );
          view.flush(() =>
            options
              .find(({ props }) => props.testID === `auth-login-language-${language}`)
              .props.onPress(),
          );
          await flushAsync();
          assert.equal(sheet.props.isPresented, false);
          assert.equal(view.findAll('Draft')[0], draft);
          assert.equal(draft.props.language, language);
          assert.equal(draft.props.direction, language === 'ar' ? 'rtl' : 'ltr');
          assert.deepEqual(draft.props.draft, {
            login: 'draft@example.com',
            password: 'secret draft',
          });
          assert.equal(
            view.findAll('Host').find(({ props }) => props.testID === 'auth-login-preferences'),
            topBar,
          );
          assert.equal(topBar.props.layoutDirection, 'leftToRight');
          assert.equal(mounts, 1);
        }
        assert.deepEqual(writes, [
          ['appLanguage', 'en'],
          ['appLanguage', 'ar'],
          ['appLanguage', 'fr'],
        ]);
        press(languageButton);
        view.flush(() =>
          view
            .findAll('Button')
            .find(({ props }) => props.testID === 'auth-login-language-close')
            .props.onPress(),
        );
        assert.equal(view.findAll('Sheet')[0].props.isPresented, false);
        assert.equal(draft.props.language, 'fr');
        press(languageButton);
        view.flush(() => view.findAll('Sheet')[0].props.onDismiss());
        assert.equal(view.findAll('Sheet')[0].props.isPresented, false);
        press(iconButton('auth-login-color-scheme'));
        assert.equal(draft.props.scheme, initialScheme);
      } finally {
        view.unmount();
      }
    });
  }
}
