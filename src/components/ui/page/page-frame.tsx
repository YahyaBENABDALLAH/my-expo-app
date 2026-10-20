import { BlurTargetView } from 'expo-blur';
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageHeader } from './page-header';
import { PageHeaderBackground } from './page-header-background';
import { PageHeaderTouchShield } from './page-header-touch-shield';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';

const PageHeaderInsetContext = createContext(0);

/** Put this inset inside scroll content so it can move beneath the floating header. */
export function usePageHeaderInset() {
  return useContext(PageHeaderInsetContext);
}

/** Owns the header safe area; overlay content retains all device insets. */
export function PageFrame({
  children,
  title,
  onBack,
  colorScheme,
  headerOverlay = false,
  headerBlur = true,
  scrollsBehindHeader = false,
}: PropsWithChildren<{
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
  headerOverlay?: boolean;
  /** Blur titled headers by default, including full-height overlays. */
  headerBlur?: boolean;
  /** Children reserve usePageHeaderInset() inside their own scroll content. */
  scrollsBehindHeader?: boolean;
}>) {
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  const insets = useSafeAreaInsets();
  const blurHeader = headerBlur && Boolean(title);
  const scrollHeader = blurHeader && scrollsBehindHeader && !headerOverlay;
  const floating = headerOverlay || scrollHeader;
  const [headerHeight, setHeaderHeight] = useState(0);
  const blurTarget = useRef<View | null>(null);
  const contentTop = headerOverlay ? insets.top : 0;
  const contentInsets = useMemo(
    () => ({ top: contentTop, bottom: insets.bottom, left: insets.left, right: insets.right }),
    [contentTop, insets.bottom, insets.left, insets.right],
  );
  const header = (
    <View
      testID="page-header-safe-area"
      pointerEvents={floating && !onBack ? 'none' : 'box-none'}
      onLayout={
        blurHeader ? ({ nativeEvent }) => setHeaderHeight(nativeEvent.layout.height) : undefined
      }
      style={{
        zIndex: 2,
        // Temporary visual debugging: show the full titled header, including its safe area.
        backgroundColor: title ? '#FF0000' : undefined,
        ...(floating ? { position: 'absolute', top: 0, left: 0, right: 0 } : {}),
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {title ? <PageHeader title={title} onBack={onBack} colorScheme={colorScheme} /> : null}
    </View>
  );
  const ContentView = blurHeader ? BlurTargetView : View;
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {!floating && header}
      <SafeAreaInsetsContext.Provider value={contentInsets}>
        <PageHeaderInsetContext.Provider value={scrollHeader ? headerHeight : 0}>
          <ContentView
            ref={blurHeader ? blurTarget : undefined}
            style={{
              flex: 1,
              // Fixed headers keep their native intrinsic height in normal layout.
              // The blur source still covers the complete frame on Android.
              ...(blurHeader && !floating
                ? { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }
                : {}),
              paddingTop: blurHeader && !headerOverlay && !scrollHeader ? headerHeight : 0,
            }}
          >
            {children}
          </ContentView>
        </PageHeaderInsetContext.Provider>
      </SafeAreaInsetsContext.Provider>
      {/* Mount the blur after its content so it tracks native scrolling on Android. */}
      {blurHeader ? (
        <PageHeaderBackground
          blurTarget={blurTarget}
          colorScheme={colorScheme}
          height={headerHeight}
        />
      ) : null}
      {floating && header}
      <PageHeaderTouchShield height={headerHeight} />
    </View>
  );
}
