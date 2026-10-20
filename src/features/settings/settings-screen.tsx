import { spacing, radii } from '@/constants/layout';
import { appDevEnabled } from '@/constants/app-dev';
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
  nativeRowWeight,
  PageFrame,
  PageSection,
  pageFormModifiers,
  Row,
  Switch,
  ThemePicker,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  usePageHeaderInset,
} from '@components/ui';
import { useLanguage } from '@/context/language.context';
import { useThemeColors } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';
import i18n, { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';
import { version as appVersion } from '../../../package.json';

const languageKeys: Record<Language, string> = {
  fr: 'common.french',
  en: 'common.english',
  ar: 'common.arabic',
};
const languageLabel = (language: Language) => i18n.getFixedT(language)(languageKeys[language]);

export default function SettingsScreen() {
  const { language, setLanguage, ready } = useLanguage();
  return <SettingsPage language={language} onLanguageChange={setLanguage} languageReady={ready} />;
}

/** Explicit preferences also let native stories run without changing saved app settings. */
export function SettingsPage({
  language,
  onLanguageChange,
  languageReady = true,
  onBack,
}: {
  language: Language;
  onLanguageChange?: (language: Language) => void;
  languageReady?: boolean;
  onBack?: () => void;
}) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [languageOpen, setLanguageOpen] = useState(false);
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  const external = (
    <Icon
      name={Icon.select({
        ios: 'arrow.up.right.square',
        android: require('@expo/material-symbols/open_in_new.xml'),
      })}
      size={20}
      color={colors.muted}
    />
  );
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
                label={t('settings.yourAccount')}
                testID="app-settings-account"
                leading={
                  <Column
                    alignment="center"
                    style={{
                      padding: spacing.md,
                      borderRadius: radii.pill,
                      backgroundColor: colors.selection,
                    }}
                  >
                    <Icon
                      name={Icon.select({
                        ios: 'person.fill',
                        android: require('@expo/material-symbols/person.xml'),
                      })}
                      size={24}
                      color={colors.tint}
                    />
                  </Column>
                }
                trailing={
                  <Text variant="caption" textStyle={{ color: colors.muted }}>
                    {t('common.signOut')}
                  </Text>
                }
              />
              <SettingsRow label={t('common.manageAccount')} trailing={external} />
              <FieldGroup.SectionFooter>
                <Text variant="caption" textStyle={{ color: colors.muted }}>
                  {t('settings.comingSoon')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section
              title={t('settings.appearance')}
              titleUppercase
              testID="app-settings-appearance"
            >
              <SettingsRow label={t('common.theme')} trailing={<ThemePicker />} />
              <SettingsRow label={t('common.colorScheme')} trailing={<ColorSchemeControl />} />
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
              {appDevEnabled ? (
                <SettingsRow
                  label={t('tools.storybook')}
                  testID="app-settings-storybook"
                  onPress={() => router.push('/storybook')}
                  trailing={chevron}
                />
              ) : null}
              <SettingsRow
                label={t('settings.componentList')}
                testID="app-settings-component-list"
                onPress={() => router.push('/ui')}
                trailing={chevron}
              />
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.socialNotifications')} titleUppercase>
              <SettingsRow
                label={t('settings.chat')}
                detail={t('settings.chatDescription')}
                trailing={<PlaceholderSwitch value testID="app-settings-chat" />}
              />
              <SettingsRow
                label={t('settings.invitations')}
                detail={t('settings.invitationsDescription')}
                trailing={<PlaceholderSwitch value testID="app-settings-invitations" />}
              />
              <FieldGroup.SectionFooter>
                <Text variant="caption" textStyle={{ color: colors.muted }}>
                  {t('settings.comingSoon')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.accountNotifications')} titleUppercase>
              <SettingsRow
                label={t('settings.authenticationRequests')}
                trailing={<PlaceholderSwitch value={false} testID="app-settings-authentication" />}
              />
              <FieldGroup.SectionFooter>
                <Text variant="caption" textStyle={{ color: colors.muted }}>
                  {t('settings.comingSoon')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.about')} titleUppercase>
              <SettingsRow label={t('settings.support')} trailing={external} />
              <SettingsRow label={t('settings.appVersion')} detail={appVersion} />
              <SettingsRow label={t('settings.privacyPolicy')} trailing={external} />
              <SettingsRow
                label={t('settings.openSourceLicenses')}
                detail={t('settings.licensesDescription')}
                trailing={chevron}
              />
              <SettingsRow
                label={t('settings.legalInformation')}
                detail={t('settings.legalDescription')}
                trailing={chevron}
              />
              <FieldGroup.SectionFooter>
                <Text variant="caption" textStyle={{ color: colors.muted }}>
                  {t('settings.comingSoon')}
                </Text>
              </FieldGroup.SectionFooter>
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

function SettingsRow({
  label,
  detail,
  leading,
  trailing,
  onPress,
  disabled = false,
  testID,
}: {
  label: string;
  detail?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  const colors = useThemeColors();
  const content = (
    <Row
      alignment="center"
      spacing={spacing.lg}
      modifiers={nativeFillWidth}
      style={{ paddingVertical: spacing.lg }}
    >
      {leading}
      <Column
        spacing={spacing.xs}
        modifiers={Platform.OS === 'ios' ? nativeFillWidth : nativeRowWeight}
      >
        <Text>{label}</Text>
        {detail ? (
          <Text fontSize={14} textStyle={{ color: colors.muted }}>
            {detail}
          </Text>
        ) : null}
      </Column>
      {trailing}
    </Row>
  );
  if (onPress) {
    return (
      <UniversalButtonContent
        variant="link"
        fullWidth
        contentPadding={spacing.none}
        onPress={() => {
          if (!disabled) onPress();
        }}
        disabled={disabled}
        testID={testID}
      >
        {content}
      </UniversalButtonContent>
    );
  }
  return (
    <Column modifiers={nativeFillWidth} disabled={disabled} testID={testID}>
      {content}
    </Column>
  );
}

function PlaceholderSwitch({ value, testID }: { value: boolean; testID: string }) {
  return <Switch value={value} disabled onValueChange={() => undefined} testID={testID} />;
}
