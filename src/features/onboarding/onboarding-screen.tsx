import {
  Column,
  Icon,
  LoadingContent,
  nativeFillWidth,
  nativeRowWeight,
  PageFrame,
  Row,
  ScrollView,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOnboarding } from '@/context/onboarding.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';

// Icon.select through the public UI barrel needs synchronous native assets:
// Expo's import() transform only recognizes direct imports from @expo/ui.
const pages = [
  {
    name: 'discover',
    icon: Icon.select({
      ios: 'fork.knife',
      android: require('@expo/material-symbols/restaurant.xml'),
    }),
    next: '/(onboarding)/cook',
  },
  {
    name: 'cook',
    icon: Icon.select({
      ios: 'book.closed.fill',
      android: require('@expo/material-symbols/menu_book.xml'),
    }),
    next: '/(onboarding)/save',
  },
  {
    name: 'save',
    icon: Icon.select({
      ios: 'bookmark.fill',
      android: require('@expo/material-symbols/bookmark.xml'),
    }),
    next: null,
  },
] as const;

export function OnboardingScreen({ step }: { step: 0 | 1 | 2 }) {
  const { t } = useTranslation();
  const { complete, saving, saveError } = useOnboarding();
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const page = pages[step];
  const finish = () => void complete();
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace(step === 2 ? '/(onboarding)/cook' : '/(onboarding)/discover');
  };

  return (
    <PageFrame colorScheme={scheme}>
      <View
        testID={`onboarding-${page.name}`}
        style={{
          flex: 1,
          alignItems: 'center',
          paddingLeft: insets.left + 24,
          paddingRight: insets.right + 24,
          paddingBottom: insets.bottom,
        }}
      >
        <UniversalHost
          colorScheme={scheme}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1, width: '100%', maxWidth: 480 }}
        >
          <ScrollView showsIndicators={false} testID="onboarding-scroll">
            <Column
              spacing={28}
              modifiers={nativeFillWidth}
              style={{ paddingTop: 16, paddingBottom: 24 }}
            >
              <Row alignment="center" spacing={12} modifiers={nativeFillWidth}>
                <Column modifiers={nativeRowWeight}>
                  <Text fontWeight="700" textStyle={{ color: colors.tint }}>
                    {t('brand.wordmark')}
                  </Text>
                </Column>
                <UniversalButtonContent
                  variant="link"
                  label={t('onboarding.skip')}
                  testID="onboarding-skip"
                  disabled={saving}
                  onPress={finish}
                />
              </Row>
              <Column
                alignment="center"
                modifiers={nativeFillWidth}
                style={{
                  paddingVertical: 48,
                  backgroundColor: colors.primaryContainer,
                  borderRadius: 32,
                }}
              >
                <Icon name={page.icon} size={88} color={colors.onPrimaryContainer} />
              </Column>
              <Column alignment="center" spacing={16} modifiers={nativeFillWidth}>
                <Text
                  variant="heading"
                  fontSize={32}
                  testID="onboarding-title"
                  textStyle={{ textAlign: 'center' }}
                >
                  {t(`onboarding.${page.name}.title`)}
                </Text>
                <Text fontSize={18} textStyle={{ textAlign: 'center', color: colors.muted }}>
                  {t(`onboarding.${page.name}.subtitle`)}
                </Text>
                <Text variant="caption" textStyle={{ textAlign: 'center', color: colors.tint }}>
                  {t(`onboarding.${page.name}.detail`)}
                </Text>
              </Column>
              <Column alignment="center" spacing={12} modifiers={nativeFillWidth}>
                <Row spacing={8} alignment="center">
                  {pages.map(({ name }, index) => (
                    <Column
                      key={name}
                      style={{
                        width: index === step ? 28 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: index === step ? colors.tint : colors.border,
                      }}
                    />
                  ))}
                </Row>
                <Text
                  variant="caption"
                  testID="onboarding-progress"
                  textStyle={{ color: colors.muted, textAlign: 'center' }}
                >
                  {`${t('onboarding.progress')} · ${step + 1} / ${pages.length}`}
                </Text>
              </Column>
              <Column spacing={12} modifiers={nativeFillWidth}>
                {saveError ? (
                  <Text testID="onboarding-save-error" textStyle={{ color: colors.error }}>
                    {t('onboarding.saveFailed')}
                  </Text>
                ) : null}
                {saving ? <LoadingContent label={t('common.wait')} /> : null}
                <UniversalButtonContent
                  variant="primary"
                  label={page.next ? t('onboarding.next') : t('onboarding.start')}
                  testID={page.next ? 'onboarding-next' : 'onboarding-start'}
                  fullWidth
                  disabled={saving}
                  onPress={page.next ? () => router.push(page.next) : finish}
                />
                {step > 0 ? (
                  <UniversalButtonContent
                    variant="secondary"
                    label={t('onboarding.back')}
                    testID="onboarding-back"
                    fullWidth
                    disabled={saving}
                    onPress={goBack}
                  />
                ) : null}
              </Column>
            </Column>
          </ScrollView>
        </UniversalHost>
      </View>
    </PageFrame>
  );
}
