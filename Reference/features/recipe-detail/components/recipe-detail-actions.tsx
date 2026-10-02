import { Icon, icons } from "@/components/Universal/icon";
import { useTheme } from "@/context/theme.context";
import { Pressable, View } from "react-native";
import Animated, {
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const HEADER_FADE_DISTANCE = 200;

export function RecipeDetailActions({
  isLiked,
  onLike,
  onShare,
  scrollOffset,
}: {
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  scrollOffset: SharedValue<number>;
}) {
  const { colors } = useTheme();
  const headerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollOffset.value,
      [0, HEADER_FADE_DISTANCE],
      ["rgba(0,0,0,0)", "rgba(0,0,0,0.85)"],
    ),
  }));

  return (
    <Animated.View
      style={[
        {
          left: 0,
          paddingBottom: 12,
          paddingHorizontal: 16,
          paddingTop: 12,
          position: "absolute",
          right: 0,
          top: 0,
          width: "100%",
          zIndex: 5,
        },
        headerStyle,
      ]}
    >
      <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: 12, marginStart: "auto" }}>
          <Pressable
            accessibilityLabel={isLiked ? "Unlike recipe" : "Like recipe"}
            accessibilityRole="button"
            accessibilityState={{ selected: isLiked }}
            onPress={onLike}
            style={{
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: 9999,
              height: 40,
              justifyContent: "center",
              width: 40,
            }}
          >
            <Icon
              name={isLiked ? icons.heartFilled : icons.heart}
              size={20}
              color={isLiked ? colors.destructive : "#ffffff"}
            />
          </Pressable>
          <Pressable
            accessibilityLabel="Share recipe"
            accessibilityRole="button"
            onPress={onShare}
            style={{
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: 9999,
              height: 40,
              justifyContent: "center",
              width: 40,
            }}
          >
            <Icon name={icons.share} size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
