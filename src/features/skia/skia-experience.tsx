import { useTranslation } from 'react-i18next';
import {
  Column,
  ScrollView,
  Spacer,
  UniversalHost,
  UniversalTextContent as Text,
  UniversalButtonContent,
  nativeFillSize,
  nativeFillWidth,
  AuroraBackground,
} from '@components/ui';
import { useState } from 'react';
import { useIsFocused } from 'expo-router';
import { View } from 'react-native';
import { useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const paletteNames = ['canvas.aurora', 'canvas.prism', 'canvas.tidal'];

export default function SkiaExperience() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
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
      {focused ? <AuroraBackground hue={hue} colorScheme={scheme} style={{ flex: 1 }} /> : null}
      <UniversalHost
        colorScheme={scheme}
        matchContents={false}
        ignoreSafeArea="all"
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <Column
          modifiers={nativeFillSize}
          style={{
            paddingTop: insets.top + 24,
            paddingBottom: 24,
            paddingLeft: Math.max(24, insets.left + 16),
            paddingRight: Math.max(24, insets.right + 16),
          }}
        >
          <Spacer flexible />
          <ScrollView showsIndicators={false}>
            <Column spacing={12} modifiers={nativeFillWidth}>
              <Text variant="caption">{t('canvas.live')}</Text>
              <Text variant="heading">{t('canvas.title')}</Text>
              <Text>{t('canvas.description')}</Text>
              <UniversalButtonContent
                variant="secondary"
                label={t('canvas.palette', { palette: t(paletteNames[palette]) })}
                onPress={changePalette}
              />
            </Column>
          </ScrollView>
        </Column>
      </UniversalHost>
    </View>
  );
}
