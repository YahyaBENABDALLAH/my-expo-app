import { useTranslation } from 'react-i18next';
import { Column } from '@expo/ui';
import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthTheme } from './auth-theme';
import { nativeFillWidth, nativeFillWidthCenter } from './native-fill-width';
import { PageAppearanceControls } from './page-appearance-controls';
import { PageFrame } from './page-frame';
import { RefreshableScrollView } from './refreshable-scroll-view';
import { UniversalHost } from './universal-host';
import { UniversalTextContent as AuthText } from './universal-text';
import { useLanguage } from '@/context/language.context';

/** Owns the native Host; children must stay in the Expo UI rendering tree. */
export function AuthScreenFrame(props: Parameters<typeof AuthScreenContent>[0]) {
  return (
    <PageFrame colorScheme={props.colorScheme} showAppearanceFooter={false}>
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
  onRefresh,
  colorScheme,
}: PropsWithChildren<{
  testID: string;
  title: string;
  description: string;
  tab?: boolean;
  onRefresh?: () => Promise<void>;
  colorScheme?: 'light' | 'dark';
}>) {
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { colors, scheme, buttonPalette } = useAuthTheme(colorScheme);
  const horizontalPadding = Math.max(24, insets.left + 16, insets.right + 16);
  return (
    <KeyboardAvoidingView
      testID={testID}
      behavior="padding"
      style={{
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: horizontalPadding,
        backgroundColor: colors.background,
      }}
    >
      <UniversalHost
        style={{ flex: 1, width: '100%', maxWidth: 480 }}
        colorScheme={scheme}
        seedColor={colors.tint}
        buttonPalette={buttonPalette}
        matchContents={false}
        ignoreSafeArea="all"
      >
        <RefreshableScrollView
          testID={`${testID}-scroll`}
          showsIndicators={false}
          onRefresh={onRefresh}
        >
          <Column
            alignment="center"
            modifiers={nativeFillWidthCenter}
            style={{
              paddingTop: insets.top + 24,
              paddingBottom: (tab ? 0 : insets.bottom) + 32,
            }}
          >
            <Column spacing={32} modifiers={nativeFillWidth}>
              <Column spacing={12} modifiers={nativeFillWidth}>
                <AuthText variant="caption" fontWeight="700" textStyle={{ color: colors.tint }}>
                  {t('brand.wordmark')}
                </AuthText>
                <AuthText
                  variant="heading"
                  textStyle={{
                    fontFamily:
                      language === 'ar'
                        ? undefined
                        : Platform.OS === 'android'
                          ? 'Inter-Black'
                          : 'InterBlack',
                    fontSize: 32,
                    lineHeight: 38,
                  }}
                >
                  {title}
                </AuthText>
                <AuthText textStyle={{ color: colors.muted, lineHeight: 24 }}>
                  {description}
                </AuthText>
              </Column>
              {children}
              <PageAppearanceControls />
            </Column>
          </Column>
        </RefreshableScrollView>
      </UniversalHost>
    </KeyboardAvoidingView>
  );
}
