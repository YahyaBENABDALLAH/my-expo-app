import { Text } from "@/components/Universal/text";
import { Image } from "@/components/ui/image";
import { useTheme } from "@/context/theme.context";
import type { RecipeItem } from "@/types/recipe.types";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export const RECIPE_HERO_HEIGHT = 400;

export function RecipeDetailHero({
  imageUri,
  recipe,
  scrollOffset,
}: {
  imageUri: string;
  recipe: RecipeItem;
  scrollOffset: SharedValue<number>;
}) {
  const { colors } = useTheme();
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-RECIPE_HERO_HEIGHT, 0, RECIPE_HERO_HEIGHT],
          [-RECIPE_HERO_HEIGHT / 2, 0, RECIPE_HERO_HEIGHT * 0.75],
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-RECIPE_HERO_HEIGHT, 0, RECIPE_HERO_HEIGHT],
          [2, 1, 1],
        ),
      },
    ],
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollOffset.value,
      [0, RECIPE_HERO_HEIGHT * 0.6],
      [1, 0],
      "clamp",
    ),
  }));

  return (
    <View style={{ backgroundColor: colors.background, height: RECIPE_HERO_HEIGHT, overflow: "hidden" }}>
      <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
        <Image
          source={{ uri: imageUri }}
          contentFit="cover"
          transition={200}
          style={{ height: "100%", width: "100%" }}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]} pointerEvents="none">
        <LinearGradient
          colors={["rgba(0,0,0,0.5)", "transparent", "transparent", "rgba(0,0,0,0.75)"]}
          locations={[0, 0.3, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View
        style={[
          { bottom: 0, left: 0, paddingBottom: 20, paddingHorizontal: 20, position: "absolute", right: 0 },
          overlayStyle,
        ]}
      >
        <View style={{ gap: 8 }}>
          {recipe.cuisineName ? (
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: colors.primary,
                borderRadius: 9999,
                opacity: 0.9,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Text
                style={[{ color: colors.primaryForeground }, { fontSize: 11, fontWeight: "600", letterSpacing: 1.6 }]}
              >
                {recipe.cuisineName}
              </Text>
            </View>
          ) : null}
          <Text
            style={[{ color: "#ffffff" }, { fontSize: 30, fontWeight: "700", letterSpacing: -1, lineHeight: 34 }]}
          >
            {recipe.title}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
