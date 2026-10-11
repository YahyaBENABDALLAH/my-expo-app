import { Column, RNHostView, Row, ScrollView, Spacer } from '@expo/ui';
import { Image, type ImageSource } from 'expo-image';
import { Platform, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useLanguage } from '@/context/language.context';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { LoadingContent } from '../loading/loading-state';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';

export type OnboardingPageProps = {
  image: ImageSource | number;
  title: string;
  description: string;
  category: string;
  step: 0 | 1 | 2;
  onNext: () => void;
  onBack?: () => void;
  onSkip: () => void;
  saving?: boolean;
  saveError?: boolean;
  colorScheme?: 'light' | 'dark';
};

/** Native content with separate viewport boundaries for the fixed header and action. */
export function OnboardingPage({
  image,
  title,
  description,
  category,
  step,
  onNext,
  onBack,
  onSkip,
  saving = false,
  saveError = false,
  colorScheme,
}: OnboardingPageProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const direction = useLayoutDirection();
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { width, height, fontScale } = useWindowDimensions();
  const pageWidth = Math.min(width - insets.left - insets.right - 48, 480);
  const compact = height < 740 || fontScale > 1.25;
  const photoHeight = Math.round(Math.min(compact ? 220 : 340, height * (compact ? 0.28 : 0.36)));
  const textAlign = direction === 'rtl' ? 'right' : 'left';
  const headingFont =
    language === 'ar' ? undefined : Platform.OS === 'android' ? 'Inter-Black' : 'InterBlack';
  const swipe = Gesture.Pan()
    .enabled(!saving)
    .activeOffsetX([-24, 24])
    .failOffsetY([-18, 18])
    .runOnJS(true)
    .onEnd(({ translationX, velocityX }) => {
      if (Math.abs(translationX) < 64 && Math.abs(velocityX) < 650) return;
      const forward = direction === 'rtl' ? translationX > 0 : translationX < 0;
      if (forward && step < 2) onNext();
      else if (!forward) onBack?.();
    });

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <GestureDetector gesture={swipe}>
        <View
          testID={`onboarding-${['discover', 'cook', 'save'][step]}`}
          collapsable={false}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <UniversalHost colorScheme={scheme} ignoreSafeArea="all" style={{ width: pageWidth }}>
            <Row
              alignment="center"
              modifiers={nativeFillWidth}
              style={{ paddingTop: insets.top + 8, paddingBottom: 16 }}
            >
              <Column modifiers={nativeRowWeight}>
                {onBack ? (
                  <UniversalButtonContent
                    variant="link"
                    label={t('onboarding.back')}
                    testID="onboarding-back"
                    disabled={saving}
                    onPress={onBack}
                  />
                ) : (
                  <Text fontSize={21} fontWeight="800" textStyle={{ letterSpacing: 2 }}>
                    {t('brand.wordmark')}
                  </Text>
                )}
              </Column>
              <UniversalButtonContent
                variant="link"
                label={t('onboarding.skipShort')}
                testID="onboarding-skip"
                disabled={saving}
                onPress={onSkip}
              />
            </Row>
          </UniversalHost>
          <UniversalHost
            colorScheme={scheme}
            matchContents={false}
            ignoreSafeArea="all"
            style={{ width: pageWidth, flex: 1 }}
          >
            <ScrollView showsIndicators={false} testID="onboarding-scroll">
              <Column spacing={compact ? 22 : 28} modifiers={nativeFillWidth}>
                <RNHostView matchContents>
                  <Image
                    source={image}
                    testID="onboarding-photo"
                    style={{ width: pageWidth, height: photoHeight, borderRadius: 28 }}
                    contentFit="cover"
                    transition={0}
                    accessible={false}
                    pointerEvents="none"
                    cachePolicy="memory-disk"
                  />
                </RNHostView>
                <Column spacing={12} modifiers={nativeFillWidth} style={{ paddingBottom: 20 }}>
                  <Text
                    fontSize={12}
                    fontWeight="700"
                    textStyle={{
                      color: colors.tint,
                      letterSpacing: language === 'ar' ? 0 : 2,
                      textAlign,
                    }}
                  >
                    {category}
                  </Text>
                  <Text
                    variant="heading"
                    fontSize={compact ? 32 : 38}
                    testID="onboarding-title"
                    textStyle={{
                      fontFamily: headingFont,
                      lineHeight: compact ? 39 : 45,
                      letterSpacing: language === 'ar' ? 0 : -1.4,
                      textAlign,
                    }}
                  >
                    {title}
                  </Text>
                  <Text
                    fontSize={17}
                    testID="onboarding-description"
                    textStyle={{ color: colors.muted, lineHeight: 26, textAlign }}
                  >
                    {description}
                  </Text>
                </Column>
              </Column>
            </ScrollView>
          </UniversalHost>
          <UniversalHost colorScheme={scheme} ignoreSafeArea="all" style={{ width: pageWidth }}>
            <Column
              spacing={20}
              modifiers={nativeFillWidth}
              style={{ paddingTop: 16, paddingBottom: insets.bottom + 16 }}
            >
              <Row alignment="center" spacing={8} modifiers={nativeFillWidth}>
                <Row spacing={7} alignment="center">
                  {[0, 1, 2].map((index) => (
                    <Column
                      key={index}
                      style={{
                        width: index === step ? 26 : 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: index === step ? colors.tint : colors.border,
                      }}
                    />
                  ))}
                </Row>
                <Spacer flexible />
                <Text
                  variant="caption"
                  testID="onboarding-progress"
                  textStyle={{ color: colors.muted }}
                >
                  {t('onboarding.page', { current: step + 1, total: 3 })}
                </Text>
              </Row>
              {saveError ? (
                <Text testID="onboarding-save-error" textStyle={{ color: colors.error }}>
                  {t('onboarding.saveFailed')}
                </Text>
              ) : null}
              {saving ? <LoadingContent label={t('common.wait')} /> : null}
              <UniversalButtonContent
                variant="primary"
                label={step === 2 ? t('onboarding.start') : t('onboarding.next')}
                testID={step === 2 ? 'onboarding-start' : 'onboarding-next'}
                fullWidth
                contentPadding={15}
                borderRadius={18}
                disabled={saving}
                onPress={onNext}
              />
            </Column>
          </UniversalHost>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
