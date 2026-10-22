import { useState } from 'react';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  FieldGroup,
  Column,
  Icon,
  PageFrame,
  Picker,
  Switch,
  TextInput,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  pageFormModifiers,
  nativeFillWidth,
  usePageHeaderInset,
} from '@components/ui';
import { screenInsets } from '@/lib/screen-insets';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { radii, spacing } from '@/constants/layout';
import { SettingsRow } from '@/features/settings/settings-row';
import { version as appVersion } from '../../../package.json';

type AppearanceMode = 'inherit' | 'light' | 'dark';

export default function FieldGroupScreen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AppearanceMode>('inherit');
  const scheme = useColorScheme(mode === 'inherit' ? undefined : mode);
  return (
    <PageFrame
      title={t('showcase.fieldGroup')}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/ui'))}
      colorScheme={scheme}
      scrollsBehindHeader
    >
      <FieldGroupContent mode={mode} onModeChange={setMode} colorScheme={scheme} />
    </PageFrame>
  );
}

// Match App Settings: the native form owns scrolling beneath the floating header.
function FieldGroupContent({
  mode,
  onModeChange,
  colorScheme,
}: {
  mode: AppearanceMode;
  onModeChange: (mode: AppearanceMode) => void;
  colorScheme: 'light' | 'dark';
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const headerInset = usePageHeaderInset();
  const direction = useLayoutDirection();
  const colors = useThemeColors(colorScheme);
  const [chat, setChat] = useState(true);
  const [invitations, setInvitations] = useState(false);
  const [name, setName] = useState(() => t('showcase.fieldGroupGallery.demoName'));
  return (
    <View
      collapsable={false}
      style={{ flex: 1, overflow: 'hidden', ...screenInsets(insets) }}
      testID="demo-field-group-viewport"
    >
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <UniversalHost
          key={Platform.OS === 'ios' ? direction : undefined}
          colorScheme={colorScheme}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1 }}
        >
          <FieldGroup
            modifiers={pageFormModifiers}
            style={{ backgroundColor: 'transparent' }}
            testID="demo-field-group"
          >
            <FieldGroup.Section title={t('common.account')} titleUppercase>
              <FieldGroup.SectionHeader>
                <Column
                  modifiers={nativeFillWidth}
                  style={{ paddingTop: headerInset }}
                  testID="demo-field-group-scroll-inset"
                >
                  <Text variant="caption" tone="muted">
                    {t('common.account').toLocaleUpperCase()}
                  </Text>
                </Column>
              </FieldGroup.SectionHeader>
              <SettingsRow
                label={name}
                detail={t('showcase.fieldGroupGallery.demoAccount')}
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
                testID="demo-field-group-account"
              />
              <FieldGroup.SectionFooter>
                <Text variant="caption" tone="muted">
                  {t('showcase.fieldGroupGallery.description')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.appearance')} titleUppercase>
              <SettingsRow
                label={t('common.colorScheme')}
                trailing={
                  <Picker
                    selectedValue={mode}
                    onValueChange={onModeChange}
                    testID="demo-field-group-appearance"
                  >
                    <Picker.Item
                      value="inherit"
                      label={t('showcase.fieldGroupGallery.followApp')}
                    />
                    <Picker.Item value="light" label={t('common.lightMode')} />
                    <Picker.Item value="dark" label={t('common.darkMode')} />
                  </Picker>
                }
              />
              <FieldGroup.SectionFooter>
                <Text variant="caption" tone="muted">
                  {t('showcase.fieldGroupGallery.appearanceHint')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.socialNotifications')} titleUppercase>
              <SettingsRow
                label={t('settings.chat')}
                detail={t('settings.chatDescription')}
                trailing={
                  <Switch value={chat} onValueChange={setChat} testID="demo-field-group-chat" />
                }
              />
              <SettingsRow
                label={t('settings.invitations')}
                detail={t('settings.invitationsDescription')}
                trailing={
                  <Switch
                    value={invitations}
                    onValueChange={setInvitations}
                    testID="demo-field-group-invitations"
                  />
                }
              />
              <FieldGroup.SectionFooter>
                <Text variant="caption" tone="muted">
                  {t('showcase.gallery.localOnly')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('common.manageAccount')} titleUppercase>
              <TextInput
                label={t('showcase.fieldGroupGallery.displayName')}
                value={name}
                onChangeText={setName}
                autoComplete="off"
                testID="demo-field-group-draft"
              />
              <FieldGroup.SectionFooter>
                <Text variant="caption" tone="muted">
                  {t('showcase.fieldGroupGallery.nameHint')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('settings.about')} titleUppercase>
              <SettingsRow label={t('settings.appVersion')} detail={appVersion} />
              <SettingsRow
                label={t('settings.title')}
                detail={t('showcase.fieldGroupGallery.openSettings')}
                onPress={() => router.push('/settings')}
                trailing={
                  <Icon
                    name={Icon.select({
                      ios: 'chevron.forward',
                      android: require('@expo/material-symbols/chevron_right.xml'),
                    })}
                    size={18}
                    color={colors.muted}
                  />
                }
                testID="demo-field-group-open-settings"
              />
            </FieldGroup.Section>
            <FieldGroup.Section title={t('showcase.gallery.interaction')}>
              <UniversalButtonContent
                variant="secondary"
                label={t('showcase.gallery.reset')}
                onPress={() => {
                  onModeChange('inherit');
                  setChat(true);
                  setInvitations(false);
                  setName(t('showcase.fieldGroupGallery.demoName'));
                }}
                testID="demo-field-group-reset"
              />
            </FieldGroup.Section>
          </FieldGroup>
        </UniversalHost>
      </KeyboardAvoidingView>
    </View>
  );
}
