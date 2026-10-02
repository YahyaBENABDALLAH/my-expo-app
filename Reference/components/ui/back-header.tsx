import { IconButton } from "@/components/Universal/button";
import { icons } from "@/components/Universal/icon";
import { useRouter } from "expo-router";
import { I18nManager, View, type ViewStyle } from "react-native";

interface BackHeaderProps {
  style?: ViewStyle;
  onPress?: () => void;
}

export function BackHeader({ style, onPress }: BackHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View
      style={[
        {
          position: "absolute",
          paddingHorizontal: 16,
          paddingBottom: 12,
          paddingTop: 12,
          zIndex: 100,
        },
        style,
      ]}
    >
      <IconButton
        icon={I18nManager.isRTL ? icons.chevronRight : icons.chevronLeft}
        accessibilityLabel="Back"
        variant="filled"
        onPress={handleBack}
        iconSize={24}
        style={{ width: 40, height: 40 }}
      />
    </View>
  );
}
