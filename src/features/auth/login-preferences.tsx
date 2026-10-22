import { spacing } from '@/constants/layout';
import {
  BottomSheet,
  ColorSchemeControl,
  nativeFillWidth,
  PageSection,
  Row,
  Spacer,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  useHostColorScheme,
} from '@components/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '@/context/language.context';
import i18n, { SUPPORTED_LANGUAGES } from '@/lib/i18n';

const languageLabels = { fr: 'common.french', en: 'common.english', ar: 'common.arabic' } as const;

/** Login's fixed native top bar; the language sheet follows the app's own direction. */
export function LoginPreferences() {
  const { t } = useTranslation();
  const { language, setLanguage, ready } = useLanguage();
  const scheme = useHostColorScheme();
  const insets = useSafeAreaInsets();
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageDisabled = !ready || !setLanguage;

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
            paddingVertical: spacing.sm,
            paddingLeft: insets.left + spacing.lg,
            paddingRight: insets.right + spacing.lg,
          }}
        >
          <UniversalButtonContent
            variant="link"
            label={t('common.language')}
            testID="auth-login-language"
            disabled={languageDisabled}
            onPress={() => setLanguageOpen(true)}
          />
          <Spacer flexible />
          <ColorSchemeControl testID="auth-login-color-scheme" />
        </Row>
      </UniversalHost>
      <BottomSheet
        isPresented={languageOpen}
        onDismiss={() => setLanguageOpen(false)}
        testID="auth-login-language-sheet"
      >
        <PageSection>
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
            fullWidth
            label={t('common.close')}
            testID="auth-login-language-close"
            onPress={() => setLanguageOpen(false)}
          />
        </PageSection>
      </BottomSheet>
    </>
  );
}
