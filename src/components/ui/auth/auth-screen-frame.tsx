import { useTranslation } from 'react-i18next';
import { Column } from '@expo/ui';
import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/use-theme';
import {
  nativeCenteredMinHeight,
  nativeFillSize,
  nativeFillWidth,
} from '../native/native-fill-width';
import { FieldGroup } from '../field-group/field-group';
import { PageFrame } from '../page/page-frame';
import { RefreshableScrollView } from '../refreshable-scroll-view/refreshable-scroll-view';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent as Text } from '../text/universal-text';
import { useLanguage } from '@/context/language.context';
import { spacing } from '@/constants/layout';
import { PageSection } from '../page/page-section';
import { pageFormModifiers } from '../page/page-form-modifiers';
import { screenInsets } from '@/lib/screen-insets';

/** Owns the native Host; children must stay in the Expo UI rendering tree. */
export function AuthScreenFrame({
  topBar,
  ...props
}: Parameters<typeof AuthScreenContent>[0] & { topBar?: ReactNode }) {
  return (
    <PageFrame colorScheme={props.colorScheme}>
      {topBar}
      <AuthScreenContent {...props} />
    </PageFrame>
  );
}

function AuthScreenContent({
  children,
  testID,
  title,
  description,
  tab = false,
  grouped = false,
  onRefresh,
  colorScheme,
}: PropsWithChildren<{
  testID: string;
  title: string;
  description: string;
  tab?: boolean;
  /** Registration keeps its native grouped form as the only scroll container. */
  grouped?: boolean;
  onRefresh?: () => Promise<void>;
  colorScheme?: 'light' | 'dark';
}>) {
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { colors, scheme } = useAppTheme(useHostColorScheme(colorScheme));
  const [viewportHeight, setViewportHeight] = useState(0);
  const platformHeadingFont = Platform.OS === 'android' ? 'Inter-Black' : 'InterBlack';
  const headingFont = language === 'ar' ? undefined : platformHeadingFont;
  const heading = (
    <Column spacing={spacing.md} modifiers={nativeFillWidth}>
      <Text variant="caption" fontWeight="700" textStyle={{ color: colors.tint }}>
        {t('brand.wordmark')}
      </Text>
      <Text variant="heading" textStyle={{ fontFamily: headingFont, fontSize: 32, lineHeight: 38 }}>
        {title}
      </Text>
      <Text textStyle={{ color: colors.muted, lineHeight: 24 }}>{description}</Text>
    </Column>
  );
  return (
    <KeyboardAvoidingView
      testID={testID}
      behavior="padding"
      style={{
        flex: 1,
        ...screenInsets(insets, { tabBarShown: tab }),
      }}
    >
      <UniversalHost
        style={{ flex: 1, width: '100%' }}
        onLayout={({ nativeEvent: { layout } }) => setViewportHeight(layout.height)}
        colorScheme={scheme}
        seedColor={colors.tint}
        matchContents={false}
        ignoreSafeArea="all"
      >
        {grouped ? (
          <FieldGroup
            testID={`${testID}-scroll`}
            modifiers={pageFormModifiers}
            style={{ backgroundColor: 'transparent' }}
          >
            {heading}
            {children}
          </FieldGroup>
        ) : (
          <RefreshableScrollView
            testID={`${testID}-scroll`}
            modifiers={nativeFillSize}
            showsIndicators={false}
            onRefresh={onRefresh}
          >
            <Column modifiers={nativeCenteredMinHeight(viewportHeight)}>
              <PageSection spacing={spacing.xl}>
                {heading}
                {children}
              </PageSection>
            </Column>
          </RefreshableScrollView>
        )}
      </UniversalHost>
    </KeyboardAvoidingView>
  );
}
