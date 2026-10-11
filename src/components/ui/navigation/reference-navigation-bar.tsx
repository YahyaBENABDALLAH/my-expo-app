import { useThemeColors } from '@/hooks/use-theme';
import { Column, Row, Spacer } from '@expo/ui';
import { useTranslation } from 'react-i18next';
import { FloatingAction } from '../floating-action/floating-action';
import type { FloatingActionButtonProps } from '../floating-action/floating-action-button.types';
import { UniversalHost, useHostLayoutDirection } from '../host/universal-host';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { NavigationGlassSurface } from './navigation-glass-surface';
import { NavigationTab } from './navigation-tab';
import type { NavigationTabName } from './navigation-tab.types';

import { View } from 'react-native';

const destinations = [
  { name: 'index', label: 'common.home', testID: 'tab-home' },
  { name: 'search', label: 'common.search', testID: 'tab-search' },
  { name: 'recipes', label: 'common.recipes', testID: 'tab-recipes' },
  { name: 'more', label: 'common.more', testID: 'tab-more' },
] as const;

export function ReferenceNavigationBar({
  colorScheme: scheme,
  selected,
  action,
  onSelect,
  leftInset = 0,
  rightInset = 0,
  bottomInset = 0,
  animate = true,
}: {
  colorScheme: 'light' | 'dark';
  selected: string;
  action: FloatingActionButtonProps;
  onSelect: (name: NavigationTabName) => void;
  leftInset?: number;
  rightInset?: number;
  bottomInset?: number;
  animate?: boolean;
}) {
  const { t } = useTranslation();
  const colors = useThemeColors(scheme);
  const direction = useHostLayoutDirection();

  const tab = (destination: (typeof destinations)[number]) => (
    <Column key={destination.name} modifiers={nativeRowWeight}>
      <NavigationTab
        {...destination}
        label={t(destination.label)}
        selected={selected === destination.name}
        color={selected === destination.name ? colors.tabBarActive : colors.tabBarInactive}
        selectedBackgroundColor={colors.tabBarSelectedBackground}
        onPress={() => onSelect(destination.name)}
      />
    </Column>
  );

  return (
    <View
      testID="main-tab-bar"
      pointerEvents="box-none"
      style={{
        direction: direction === 'rightToLeft' ? 'rtl' : 'ltr',
        height: 84 + bottomInset,
        // Keep the whole action inside the touch bounds while reserving only
        // the 56-point dock and system inset in the navigator's layout.
        marginTop: -28,
        flexShrink: 0,
        zIndex: 1,
      }}
    >
      <View
        testID="tab-dock-surface"
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          top: 28,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.tabBarGlassTint,
          shadowColor: colors.tabBarShadow,
          shadowOpacity: scheme === 'dark' ? 0.3 : 0,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          // Android elevation casts its own shadow independently of shadowOpacity.
          // zIndex below keeps the controls above the glass without a light-mode shadow.
          elevation: scheme === 'dark' ? 8 : 0,
        }}
      >
        <NavigationGlassSurface colorScheme={scheme} />
      </View>
      {/* Side cutouts protect controls without insetting the bar surface.
            The raised action remains a sibling of the clipped tab row. */}
      <View
        testID="tab-dock-controls"
        style={{
          position: 'absolute',
          top: 28,
          left: leftInset,
          right: rightInset,
          height: 56,
          overflow: 'hidden',
          zIndex: 1,
          elevation: scheme === 'dark' ? 9 : 0,
        }}
      >
        <UniversalHost
          colorScheme={scheme}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1, height: 56 }}
        >
          <Row alignment="center" modifiers={nativeFillWidth} style={{ height: 56 }}>
            {destinations.slice(0, 2).map(tab)}
            <Spacer size={84} />
            {destinations.slice(2).map(tab)}
          </Row>
        </UniversalHost>
      </View>
      <View
        testID="tab-action-overlay"
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 0,
          left: leftInset,
          right: rightInset,
          height: 84,
          zIndex: 2,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            start: '50%',
            marginStart: -42,
            width: 84,
            height: 84,
            padding: 4,
            borderRadius: 42,
            backgroundColor: colors.tabBarGlassTint,
            elevation: scheme === 'dark' ? 10 : 0,
          }}
        >
          <FloatingAction {...action} colorScheme={scheme} animate={animate} />
        </View>
      </View>
    </View>
  );
}
