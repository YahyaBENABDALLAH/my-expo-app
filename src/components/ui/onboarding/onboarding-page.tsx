import { Column, RNHostView, Row, ScrollView, Spacer } from '@expo/ui';
import { Image, type ImageSource } from 'expo-image';
import { useEffect, useState } from 'react';
import { BackHandler, Platform, View, useWindowDimensions } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useLanguage } from '@/context/language.context';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { LoadingContent } from '../loading/loading-state';
import { nativeFillSize, nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';
import { OnboardingPager } from './onboarding-pager';

type OnboardingSlide = {
  id: string;
  image: ImageSource | number;
  title: string;
  description: string;
  category: string;
};

export type OnboardingPageProps = {
  pages: readonly OnboardingSlide[];
  initialStep?: number;
  onComplete: () => void;
  onSkip: () => void;
  saving?: boolean;
  saveError?: boolean;
  colorScheme?: 'light' | 'dark';
};

/** One persistent screen: native paging moves only the photo and introduction copy. */
export function OnboardingPage({
  pages,
  initialStep = 0,
  onComplete,
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
  const reducedMotion = useReducedMotion();
  const { width, height, fontScale } = useWindowDimensions();
  const [step, setStep] = useState(initialStep);
  const pageWidth = Math.min(width - insets.left - insets.right - 48, 480);
  const compact = height < 740 || fontScale > 1.25;
  const photoHeight = Math.round(Math.min(compact ? 200 : 320, height * (compact ? 0.26 : 0.35)));
  const textAlign = direction === 'rtl' ? 'right' : 'left';
  const headingFont =
    language === 'ar' ? undefined : Platform.OS === 'android' ? 'Inter-Black' : 'InterBlack';
  const lastStep = pages.length - 1;
  const changeStep = (next: number) => {
    if (!saving && Number.isInteger(next) && next >= 0 && next <= lastStep) setStep(next);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (saving) return true;
      if (step === 0) return false;
      setStep((current) => current - 1);
      return true;
    });
    return () => subscription.remove();
  }, [step, saving]);

  return (
    <View
      testID={`onboarding-${pages[step].id}`}
      style={{ flex: 1, alignItems: 'center', backgroundColor: colors.background }}
    >
      <UniversalHost
        testID="onboarding-header"
        colorScheme={scheme}
        ignoreSafeArea="all"
        style={{ width: pageWidth }}
      >
        <Row
          alignment="center"
          modifiers={nativeFillWidth}
          style={{ paddingTop: insets.top + 8, paddingBottom: compact ? 16 : 24 }}
        >
          <Text fontSize={21} fontWeight="800" textStyle={{ letterSpacing: 2 }}>
            {t('brand.wordmark')}
          </Text>
          <Spacer flexible />
          <UniversalButtonContent
            variant="link"
            label={t('onboarding.skipShort')}
            testID="onboarding-skip"
            disabled={saving}
            onPress={() => {
              if (!saving) onSkip();
            }}
          />
        </Row>
      </UniversalHost>
      <UniversalHost
        colorScheme={scheme}
        matchContents={false}
        ignoreSafeArea="all"
        pointerEvents={saving ? 'none' : 'auto'}
        style={{ width: pageWidth, flex: 1 }}
      >
        <OnboardingPager
          step={step}
          onStepChange={changeStep}
          disabled={saving}
          reducedMotion={reducedMotion}
        >
          {pages.map((page) => (
            <ScrollView key={page.id} showsIndicators={false} modifiers={nativeFillSize}>
              <Column spacing={compact ? 24 : 32} modifiers={nativeFillWidth}>
                <RNHostView matchContents>
                  <Image
                    source={page.image}
                    testID={`onboarding-photo-${page.id}`}
                    style={{ width: pageWidth, height: photoHeight, borderRadius: 32 }}
                    contentFit="cover"
                    transition={0}
                    accessible={false}
                    pointerEvents="none"
                    cachePolicy="memory-disk"
                  />
                </RNHostView>
                <Column spacing={12} modifiers={nativeFillWidth} style={{ paddingBottom: 16 }}>
                  <Text
                    fontSize={11}
                    fontWeight="700"
                    textStyle={{
                      color: colors.tint,
                      letterSpacing: language === 'ar' ? 0 : 1.8,
                      textAlign,
                    }}
                  >
                    {page.category}
                  </Text>
                  <Text
                    variant="heading"
                    fontSize={compact ? 30 : 36}
                    testID={`onboarding-title-${page.id}`}
                    textStyle={{
                      fontFamily: headingFont,
                      lineHeight: compact ? 37 : 43,
                      letterSpacing: language === 'ar' ? 0 : -1.2,
                      textAlign,
                    }}
                  >
                    {page.title}
                  </Text>
                  <Text
                    fontSize={16}
                    testID={`onboarding-description-${page.id}`}
                    textStyle={{ color: colors.muted, lineHeight: 25, textAlign }}
                  >
                    {page.description}
                  </Text>
                </Column>
              </Column>
            </ScrollView>
          ))}
        </OnboardingPager>
      </UniversalHost>
      <UniversalHost
        testID="onboarding-footer"
        colorScheme={scheme}
        ignoreSafeArea="all"
        style={{ width: pageWidth }}
      >
        <Column
          spacing={20}
          modifiers={nativeFillWidth}
          style={{ paddingTop: 20, paddingBottom: insets.bottom + 16 }}
        >
          <Row alignment="center" spacing={8} modifiers={nativeFillWidth}>
            <Row spacing={7} alignment="center">
              {pages.map((page, index) => (
                <Column
                  key={page.id}
                  style={{
                    width: index === step ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
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
              {t('onboarding.page', { current: step + 1, total: pages.length })}
            </Text>
          </Row>
          {saveError ? (
            <Text testID="onboarding-save-error" textStyle={{ color: colors.error }}>
              {t('onboarding.saveFailed')}
            </Text>
          ) : null}
          {saving ? <LoadingContent label={t('common.wait')} /> : null}
          <Row alignment="center" spacing={16} modifiers={nativeFillWidth}>
            <UniversalButtonContent
              variant="link"
              label={t('onboarding.back')}
              testID="onboarding-back"
              disabled={saving || step === 0}
              onPress={() => changeStep(step - 1)}
            />
            <Column modifiers={nativeRowWeight}>
              <UniversalButtonContent
                variant="primary"
                label={step === lastStep ? t('onboarding.start') : t('onboarding.next')}
                testID={step === lastStep ? 'onboarding-start' : 'onboarding-next'}
                fullWidth
                contentPadding={16}
                borderRadius={18}
                disabled={saving}
                onPress={() => {
                  if (saving) return;
                  if (step === lastStep) onComplete();
                  else changeStep(step + 1);
                }}
              />
            </Column>
          </Row>
        </Column>
      </UniversalHost>
    </View>
  );
}
