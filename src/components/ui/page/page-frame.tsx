import { useMemo, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageHeader } from './page-header';

/** Owns the header safe area; overlay content retains all device insets. */
export function PageFrame({
  children,
  title,
  onBack,
  colorScheme,
  headerOverlay = false,
}: PropsWithChildren<{
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
  headerOverlay?: boolean;
}>) {
  const insets = useSafeAreaInsets();
  const contentTop = headerOverlay ? insets.top : 0;
  const contentInsets = useMemo(
    () => ({ top: contentTop, bottom: insets.bottom, left: insets.left, right: insets.right }),
    [contentTop, insets.bottom, insets.left, insets.right],
  );
  return (
    <View style={{ flex: 1 }}>
      <View
        testID="page-header-safe-area"
        pointerEvents={headerOverlay && !onBack ? 'none' : 'box-none'}
        style={{
          ...(headerOverlay ? { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 } : {}),
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {title ? <PageHeader title={title} onBack={onBack} colorScheme={colorScheme} /> : null}
      </View>
      <SafeAreaInsetsContext.Provider value={contentInsets}>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}
