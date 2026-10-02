import { Icon, icons } from "@/components/Universal/icon";
import { Card } from "@/components/ui/surface";
import { I18nManager, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { Skeleton } from "./skeleton";

const HERO_HEIGHT = 400;

export function RecipeDetailSkeleton({
  onBack,
}: {
  onBack: () => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 128 }}
      >
        <View style={{ height: HERO_HEIGHT }}>
          <Skeleton style={{ height: "100%", width: "100%" }} />
          <View style={{ position: "absolute", start: 16, top: 12 }}>
            <Pressable
              onPress={onBack}
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999,
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <Icon
                name={I18nManager.isRTL ? icons.arrowRight : icons.arrowLeft}
                size={20}
                color="#ffffff"
              />
            </Pressable>
          </View>
        </View>

        <View style={{ gap: 12, paddingHorizontal: 20, paddingVertical: 20 }}>
          <Skeleton style={{ height: 20, width: 160, borderRadius: 9999 }} />
          <Skeleton style={{ height: 20, width: 240, borderRadius: 9999 }} />
        </View>

        <Card
          elevation="item"
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            gap: 12,
            padding: 20,
          }}
        >
          <Skeleton style={{ height: 24, width: 128, borderRadius: 9999 }} />
          <Skeleton style={{ height: 16, width: "100%", borderRadius: 9999 }} />
          <Skeleton style={{ height: 16, borderRadius: 9999, width: "80%" }} />
        </Card>

        <Card
          elevation="item"
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            gap: 12,
            padding: 20,
          }}
        >
          <Skeleton style={{ height: 24, width: 128, borderRadius: 9999 }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              style={{ height: 16, width: "100%", borderRadius: 9999 }}
            />
          ))}
        </Card>
      </Animated.ScrollView>
    </View>
  );
}
