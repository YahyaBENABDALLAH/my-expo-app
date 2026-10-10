import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';
import { PageHeader } from './page-header';
import { PageAppearanceFooter } from '../appearance/page-appearance-controls';

/** RN separates title, specialized content and its footer; native scroll pages supply their own footer. */
export function PageFrame({
  children,
  title,
  onBack,
  colorScheme,
  showAppearanceFooter = true,
  tab = false,
}: PropsWithChildren<{
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
  showAppearanceFooter?: boolean;
  tab?: boolean;
}>) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors(colorScheme);
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        testID="page-header-safe-area"
        style={{
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          backgroundColor: colors.surface,
        }}
      >
        {title ? <PageHeader title={title} onBack={onBack} colorScheme={colorScheme} /> : null}
      </View>
      <SafeAreaInsetsContext.Provider
        value={{ ...insets, top: 0, bottom: showAppearanceFooter ? 0 : insets.bottom }}
      >
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaInsetsContext.Provider>
      {showAppearanceFooter ? (
        <View
          style={{
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: tab ? 0 : insets.bottom,
            backgroundColor: colors.surface,
          }}
        >
          <PageAppearanceFooter colorScheme={colorScheme} />
        </View>
      ) : null}
    </View>
  );
}
