import { Column, Icon, Row, Spacer } from '@expo/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/language.context';
import { useThemeSettings } from '@/context/theme.context';
import i18n, { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalHost } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';
import { AuthIconButton } from './auth-icon-button';
import { useAuthTheme } from './auth-theme';

const icons = {
  language: Icon.select({ ios: 'globe', android: require('@expo/material-symbols/language.xml') }),
  sun: Icon.select({ ios: 'sun.max', android: require('@expo/material-symbols/light_mode.xml') }),
  moon: Icon.select({ ios: 'moon', android: require('@expo/material-symbols/dark_mode.xml') }),
};
const languageLabels = { fr: 'common.french', en: 'common.english', ar: 'common.arabic' } as const;

/** Login's fixed native top bar; the language sheet follows the app's own direction. */
export function LoginPreferences() {
  const { t } = useTranslation();
  const { language, setLanguage, ready } = useLanguage();
  const { setColorScheme } = useThemeSettings();
  const { scheme, colors } = useAuthTheme();
  const insets = useSafeAreaInsets();
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageDisabled = !ready || !setLanguage;
  const dark = scheme === 'dark';

  return (
    <>
      <UniversalHost
        colorScheme={scheme}
        layoutDirection="leftToRight"
        ignoreSafeArea="all"
        testID="auth-login-preferences"
      >
        <Row
          alignment="center"
          modifiers={nativeFillWidth}
          style={{
            paddingVertical: 8,
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
          }}
        >
          <AuthIconButton
            icon={icons.language}
            color={colors.tint}
            accessibilityLabel={t('common.language')}
            testID="auth-login-language"
            disabled={languageDisabled}
            onPress={() => setLanguageOpen(true)}
          />
          <Spacer flexible />
          <AuthIconButton
            icon={dark ? icons.sun : icons.moon}
            color={colors.tint}
            accessibilityLabel={t(dark ? 'common.lightMode' : 'common.darkMode')}
            testID="auth-login-color-scheme"
            onPress={() => setColorScheme(dark ? 'light' : 'dark')}
          />
        </Row>
      </UniversalHost>
      <BottomSheet
        isPresented={languageOpen}
        onDismiss={() => setLanguageOpen(false)}
        testID="auth-login-language-sheet"
      >
        <Column spacing={12} modifiers={nativeFillWidth} style={{ padding: 24 }}>
          <Text variant="title">{t('common.language')}</Text>
          {SUPPORTED_LANGUAGES.map((value) => (
            <UniversalButtonContent
              key={value}
              variant={language === value ? 'primary' : 'secondary'}
              fullWidth
              label={i18n.getFixedT(value)(languageLabels[value])}
              testID={`auth-login-language-${value}`}
              disabled={languageDisabled}
              onPress={() => {
                setLanguage?.(value);
                setLanguageOpen(false);
              }}
            />
          ))}
          <UniversalButtonContent
            variant="link"
            label={t('common.close')}
            testID="auth-login-language-close"
            onPress={() => setLanguageOpen(false)}
          />
        </Column>
      </BottomSheet>
    </>
  );
}
