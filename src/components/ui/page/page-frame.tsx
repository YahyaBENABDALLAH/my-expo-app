import { useMemo, type PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageHeader, type PageHeaderAction } from './page-header';

/** Owns the header safe area; content handles the remaining edges. */
export function PageFrame({
  children,
  title,
  onBack,
  colorScheme,
  headerAction,
}: PropsWithChildren<{
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
  headerAction?: PageHeaderAction;
}>) {
  const insets = useSafeAreaInsets();
  const contentInsets = useMemo(
    () => ({ top: 0, bottom: insets.bottom, left: insets.left, right: insets.right }),
    [insets.bottom, insets.left, insets.right],
  );
  return (
    <View style={{ flex: 1 }}>
      <View
        testID="page-header-safe-area"
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {title ? (
          <PageHeader
            title={title}
            onBack={onBack}
            colorScheme={colorScheme}
            action={headerAction}
          />
        ) : null}
      </View>
      <SafeAreaInsetsContext.Provider value={contentInsets}>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaInsetsContext.Provider>
    </View>
  );
}
