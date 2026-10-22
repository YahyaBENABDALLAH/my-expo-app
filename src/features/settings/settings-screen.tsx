import { spacing } from '@/constants/layout';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheet,
  ColorSchemeControl,
  Column,
  FieldGroup,
  Icon,
  nativeFillWidth,
  PageFrame,
  PageSection,
  pageFormModifiers,
  Row,
  Switch,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  usePageHeaderInset,
} from '@components/ui';
import { useLanguage } from '@/context/language.context';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useThemeSettings } from '@/context/theme.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useAuthGuards } from '@/guards/auth-guards';
import { useThemeColors } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';
import i18n, { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';
import { version as appVersion } from '../../../package.json';
import { HeaderMotionPicker } from './header-motion-picker';
import { SettingsRow } from './settings-row';
import { ThemePicker } from './theme-picker';

const languageKeys: Record<Language, string> = {
  fr: 'common.french',
  en: 'common.english',
  ar: 'common.arabic',
};
const languageLabel = (language: Language) => i18n.getFixedT(language)(languageKeys[language]);

export default function SettingsScreen() {
  const { language, setLanguage, ready } = useLanguage();
  const { requireAuth } = useAuthGuards();
  return (
    <SettingsPage
      language={language}
      onLanguageChange={setLanguage}
      languageReady={ready}
      authenticated={requireAuth}
    />
  );
}

/** Explicit preferences also let native stories run without changing saved app settings. */
export function SettingsPage({
  language,
  onLanguageChange,
  languageReady = true,
  authenticated = false,
  onBack,
}: {
  language: Language;
  onLanguageChange?: (language: Language) => void;
  languageReady?: boolean;
  authenticated?: boolean;
  onBack?: () => void;
}) {
  const { t } = useTranslation();
  const direction = useLayoutDirection();
  const colors = useThemeColors();
  const { setReducedMotion, headerMotionReady } = useThemeSettings();
  const reducedMotion = useAppReducedMotion();
  const [languageOpen, setLanguageOpen] = useState(false);
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  const chevron = (
    <Icon
      name={Icon.select({
        ios: 'chevron.forward',
        android: require('@expo/material-symbols/chevron_right.xml'),
      })}
      size={18}
      color={colors.muted}
    />
  );
  return (
    <PageFrame title={t('settings.title')} onBack={back} scrollsBehindHeader>
      <SettingsViewport>
        <UniversalHost
          // Recreate only this iOS form host when direction flips; reused native cells mirror text.
          key={Platform.OS === 'ios' ? direction : undefined}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1 }}
          testID="app-settings-content"
        >
          <FieldGroup
            modifiers={pageFormModifiers}
            style={{ backgroundColor: 'transparent' }}
            testID="app-settings-groups"
          >
            <FieldGroup.Section title={t('common.account')} titleUppercase>
              <FieldGroup.SectionHeader>
                <SettingsAccountHeader />
              </FieldGroup.SectionHeader>
              <SettingsRow
                label={t(authenticated ? 'common.account' : 'auth.signIn')}
                testID="app-settings-account"
                onPress={() => router.push(authenticated ? '/account' : '/login')}
                trailing={chevron}
              />
            </FieldGroup.Section>
            <FieldGroup.Section
              title={t('settings.appearance')}
              titleUppercase
              testID="app-settings-appearance"
            >
              <SettingsRow label={t('common.theme')} trailing={<ThemePicker />} />
              <SettingsRow label={t('common.colorScheme')} trailing={<ColorSchemeControl />} />
              <SettingsRow label={t('settings.headerMotion')} trailing={<HeaderMotionPicker />} />
              <Switch
                label={t('settings.reduceMotion')}
                value={reducedMotion}
                onValueChange={setReducedMotion}
                disabled={!headerMotionReady}
                modifiers={nativeFillWidth}
                testID="app-settings-reduce-motion"
              />
              <SettingsRow
                label={t('common.language')}
                testID="app-settings-language"
                disabled={!languageReady || !onLanguageChange}
                onPress={() => {
                  if (languageReady && onLanguageChange) setLanguageOpen(true);
                }}
                trailing={
                  <Row alignment="center" spacing={spacing.sm}>
                    <Text textStyle={{ color: colors.muted }}>{languageLabel(language)}</Text>
                    {chevron}
                  </Row>
                }
              />
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.components')} titleUppercase>
              <SettingsRow
                label={t('settings.componentList')}
                testID="app-settings-component-list"
                onPress={() => router.push('/ui')}
                trailing={chevron}
              />
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.about')} titleUppercase>
              <SettingsRow label={t('settings.appVersion')} detail={appVersion} />
            </FieldGroup.Section>
          </FieldGroup>
        </UniversalHost>
        {/* A sheet owns a Host; isolate its presentation from the form's native hit-testing tree. */}
        <UniversalHost
          style={{ position: 'absolute' }}
          pointerEvents="box-none"
          testID="app-settings-language-presentation"
        >
          <BottomSheet
            isPresented={languageOpen}
            onDismiss={() => setLanguageOpen(false)}
            testID="app-settings-language-sheet"
          >
            <PageSection>
              <Text variant="title" testID="app-settings-language-title">
                {t('common.language')}
              </Text>
              {SUPPORTED_LANGUAGES.map((value) => (
                <SettingsRow
                  key={value}
                  label={languageLabel(value)}
                  testID={`app-settings-language-${value}`}
                  disabled={!languageReady || !onLanguageChange}
                  onPress={() => {
                    if (!languageReady || !onLanguageChange) return;
                    onLanguageChange(value);
                    setLanguageOpen(false);
                  }}
                  trailing={
                    language === value ? (
                      <Icon
                        name={Icon.select({
                          ios: 'checkmark',
                          android: require('@expo/material-symbols/check.xml'),
                        })}
                        size={20}
                        color={colors.tint}
                      />
                    ) : undefined
                  }
                />
              ))}
              <UniversalButtonContent
                variant="link"
                label={t('common.close')}
                testID="app-settings-language-close"
                onPress={() => setLanguageOpen(false)}
              />
            </PageSection>
          </BottomSheet>
        </UniversalHost>
      </SettingsViewport>
    </PageFrame>
  );
}

/** Keep the initial header clearance inside the form so rows can scroll beneath the blur. */
function SettingsAccountHeader() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const headerInset = usePageHeaderInset();
  return (
    <Column
      modifiers={nativeFillWidth}
      style={{ paddingTop: headerInset }}
      testID="app-settings-scroll-inset"
    >
      <Text variant="caption" textStyle={{ color: colors.muted }}>
        {t('common.account').toLocaleUpperCase()}
      </Text>
    </Column>
  );
}

// FieldGroup owns scrolling; the RN boundary supplies a bounded native viewport and safe areas.
function SettingsViewport({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      testID="app-settings-viewport"
      collapsable={false}
      style={{ flex: 1, overflow: 'hidden', ...screenInsets(insets) }}
    >
      {children}
    </View>
  );
}
