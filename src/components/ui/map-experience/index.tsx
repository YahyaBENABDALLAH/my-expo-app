import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column } from '@expo/ui';
import { UniversalHost } from '../host/universal-host';
import { UniversalTextContent as Text } from '../text/universal-text';
import { nativeFillWidth } from '../native/native-fill-width';
import MapView, { Marker } from 'react-native-maps';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CASABLANCA = { latitude: 33.5731, longitude: -7.5898 };

export function MapExperience() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{ ...CASABLANCA, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        mapPadding={{ top: insets.top, left: insets.left, right: insets.right, bottom: 0 }}
        showsCompass
        accessibilityLabel={t('map.label')}
      >
        <Marker coordinate={CASABLANCA} title={t('map.city')} description={t('map.exploreCity')} />
      </MapView>
      <UniversalHost
        style={{
          position: 'absolute',
          left: Math.max(20, insets.left + 12),
          right: Math.max(20, insets.right + 12),
          bottom: 20,
          width: undefined,
        }}
      >
        <Column
          spacing={8}
          modifiers={nativeFillWidth}
          style={{ backgroundColor: colors.surface, padding: 20, borderRadius: 24 }}
        >
          <Text variant="caption">{t('map.title')}</Text>
          <Text variant="title">{t('map.city')}</Text>
          <Text>{t('map.instructions')}</Text>
        </Column>
      </UniversalHost>
    </View>
  );
}
