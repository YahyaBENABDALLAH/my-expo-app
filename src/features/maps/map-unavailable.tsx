import { Linking, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/layout';

export function MapUnavailable({ message }: { message: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E9F1EE',
        paddingTop: insets.top + 24,
        paddingBottom: TAB_BAR_CONTENT_HEIGHT + insets.bottom + 24,
        paddingLeft: Math.max(24, insets.left + 16),
        paddingRight: Math.max(24, insets.right + 16),
      }}
    >
      <View
        style={{
          maxWidth: 420,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 28,
          gap: 14,
        }}
      >
        <Text style={{ color: '#53736B', fontSize: 12, letterSpacing: 2 }}>EXPLORE THE MAP</Text>
        <Text style={{ color: '#173C35', fontFamily: 'Inter-Black', fontSize: 30 }}>
          Casablanca
        </Text>
        <Text style={{ color: '#4B645F', fontSize: 15 }}>{message}</Text>
        <Pressable
          accessibilityRole="link"
          onPress={() =>
            void Linking.openURL('https://www.openstreetmap.org/#map=12/33.5731/-7.5898')
          }
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#173C35',
            borderRadius: 14,
            paddingHorizontal: 18,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>Open map</Text>
        </Pressable>
      </View>
    </View>
  );
}
