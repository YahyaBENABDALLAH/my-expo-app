import { useState } from 'react';
import { useIsFocused } from 'expo-router';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/visuals/aurora-background';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/layout';

const paletteNames = ['Aurora', 'Prism', 'Tidal'];

export default function SkiaExperience() {
  const focused = useIsFocused();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;
  const reduceMotion = useReducedMotion();
  const hue = useSharedValue(0);
  const [palette, setPalette] = useState(0);

  const changePalette = () => {
    const next = (palette + 1) % paletteNames.length;
    setPalette(next);
    hue.set(withTiming(next * 2.1, { duration: reduceMotion ? 0 : 250 }));
  };

  return (
    <View style={{ flex: 1 }}>
      {focused ? <AuroraBackground hue={hue} style={{ flex: 1 }} /> : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          position: 'absolute',
          left: Math.max(24, insets.left + 16),
          right: Math.max(24, insets.right + 16),
          bottom: tabBarHeight + 24,
          maxHeight: Math.max(0, height - insets.top - tabBarHeight - 48),
        }}
        contentContainerStyle={{ gap: 12 }}
      >
        <Text style={{ color: '#B8E9FF', fontSize: 12, letterSpacing: 2 }}>LIVE CANVAS</Text>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-Black', fontSize: 40 }}>
          Light in motion
        </Text>
        <Text style={{ color: '#DBEDF4', fontSize: 15, lineHeight: 22 }}>
          A Skia shader animated with Reanimated. Change the colors and watch the canvas respond.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Change color palette, currently ${paletteNames[palette]}`}
          onPress={changePalette}
          style={{
            alignSelf: 'flex-start',
            marginTop: 8,
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Text style={{ color: '#132943', fontWeight: '700' }}>
            Palette: {paletteNames[palette]}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
