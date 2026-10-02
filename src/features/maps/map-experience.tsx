import MapView, { Marker } from 'react-native-maps';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/layout';

const CASABLANCA = { latitude: 33.5731, longitude: -7.5898 };

export function MapExperience() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: '#E9F1EE', paddingBottom: tabBarHeight }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{ ...CASABLANCA, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        showsCompass
        accessibilityLabel="Map centered on Casablanca"
      >
        <Marker coordinate={CASABLANCA} title="Casablanca" description="Explore the city" />
      </MapView>
      <View
        style={{
          position: 'absolute',
          left: Math.max(20, insets.left + 12),
          right: Math.max(20, insets.right + 12),
          bottom: tabBarHeight + 20,
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 24,
          borderCurve: 'continuous',
          boxShadow: '0 8px 24px rgba(20, 43, 54, 0.16)',
          gap: 5,
        }}
      >
        <Text style={{ color: '#53736B', fontSize: 12, letterSpacing: 2 }}>EXPLORE THE MAP</Text>
        <Text style={{ color: '#173C35', fontFamily: 'Inter-Black', fontSize: 27 }}>
          Casablanca
        </Text>
        <Text style={{ color: '#4B645F', fontSize: 14 }}>
          Pinch to zoom, drag to explore, or tap the marker.
        </Text>
      </View>
    </View>
  );
}
