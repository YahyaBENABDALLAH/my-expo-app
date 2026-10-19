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
  headerBlur = false,
}: PropsWithChildren<{
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
  headerOverlay?: boolean;
  /** Float a blurred header; scrolling children must include usePageHeaderInset(). */
  headerBlur?: boolean;
}>) {
  const insets = useSafeAreaInsets();
  const blurHeader = headerBlur && Boolean(title);
  const floating = headerOverlay || blurHeader;
  const [headerHeight, setHeaderHeight] = useState(0);
  const blurTarget = useRef<View | null>(null);
  const contentTop = headerOverlay && !blurHeader ? insets.top : 0;
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
        ...(floating ? { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 } : {}),
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
    <View style={{ flex: 1 }}>
      {!floating && header}
      <SafeAreaInsetsContext.Provider value={contentInsets}>
        <PageHeaderInsetContext.Provider value={blurHeader ? headerHeight : 0}>
          <ContentView ref={blurHeader ? blurTarget : undefined} style={{ flex: 1 }}>
            {children}
          </ContentView>
        </PageHeaderInsetContext.Provider>
      </SafeAreaInsetsContext.Provider>
      {/* Mount the blur after its content so it tracks native scrolling on Android. */}
      {blurHeader ? (
        <PageHeaderBackground blurTarget={blurTarget} colorScheme={colorScheme} />
      ) : null}
      {floating && header}
    </View>
  );
}
