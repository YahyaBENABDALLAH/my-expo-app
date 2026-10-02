import { useState } from 'react';
import { Text, View } from 'react-native';
import Colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { UniversalButton } from '@/components/ui/universal-button';

export function AuthSubmit({
  testID,
  label,
  pending,
  onPress,
  notice,
}: {
  testID: string;
  label: string;
  pending: boolean;
  onPress: () => void;
  notice?: string;
}) {
  const [width, setWidth] = useState(0);
  const scheme = useColorScheme();
  return (
    <View
      style={{ gap: 16 }}
      onLayout={({ nativeEvent }) => setWidth(Math.round(nativeEvent.layout.width))}
    >
      {width > 0 ? (
        <UniversalButton
          testID={testID}
          label={pending ? 'Checking…' : label}
          disabled={pending}
          size="large"
          colorScheme={scheme}
          style={{ width }}
          onPress={onPress}
        />
      ) : null}
      {notice ? (
        <Text
          testID={`${testID}-status`}
          accessibilityLiveRegion="polite"
          selectable
          style={{ color: Colors[scheme].success, fontSize: 15, lineHeight: 22 }}
        >
          {notice}
        </Text>
      ) : null}
    </View>
  );
}
