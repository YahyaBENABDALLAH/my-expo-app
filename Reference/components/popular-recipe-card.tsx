import { Host } from "@/components/Universal/host";
import { Icon, icons } from "@/components/Universal/icon";
import { Column, RNHostView, Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Image } from "@/components/ui/image";
import { SafePressable } from "@/components/ui/safe-pressable";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";
import type { PopularRecipe } from "@/types/home.types";
import { View } from "react-native";

interface PopularRecipeCardProps {
  item: PopularRecipe;
  width?: number;
  onPress: () => void;
}

export function PopularRecipeCard({
  item,
  width,
  onPress,
}: PopularRecipeCardProps) {
  const { colors, tokens } = useTheme();

  return (
    <SafePressable
      accessibilityHint="Opens recipe details"
      accessibilityLabel={`${item.title}. ${item.duration}. ${item.subtitle}`}
      onPress={onPress}
      style={[{ gap: 4 }, width ? { width } : { flex: 1, minWidth: "45%" }]}
    >
      {/* The card owns elevation; the inner view clips image content. */}
      <Card
        style={{
          position: "relative",
          height: width ? width * 0.82 : 176,
        }}
      >
        {/* Inner View handles overflow clipping for images and absolute elements */}
        <View
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 14,
          }}
        >
          <Image
            source={{ uri: item.imageUri }}
            contentFit="cover"
            transition={200}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              height: "100%",
              width: "100%",
            }}
          />

          <View
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              borderRadius: 9999,
              backgroundColor: colors.card,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Host
              aria-hidden
              matchContents
              pointerEvents="none"
            >
              <Row alignment="center" spacing={8}>
                <Icon name={icons.heartFilled} size={15} color="#ef4444" />
                <Text
                  style={[{ color: colors.foreground }, { fontSize: 16, fontWeight: "600" }]}
                >
                  {item.popularityLabel}
                </Text>
              </Row>
            </Host>
          </View>
          {item.chefName ? (
            <View
              style={[
                tokens.shadows.floatingAction,
                {
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  borderRadius: 9999,
                  backgroundColor: colors.card,
                  padding: 2,
                  paddingRight: 12,
                },
              ]}
            >
              <Host
                aria-hidden
                matchContents
                pointerEvents="none"
              >
                <Row alignment="center" spacing={8}>
                  {item.chefAvatarUrl ? (
                    <RNHostView
                      matchContents
                      style={{ height: 24, width: 24 }}
                    >
                      <Image
                        source={{ uri: item.chefAvatarUrl }}
                        style={{ width: 24, height: 24, borderRadius: 9999 }}
                        contentFit="cover"
                      />
                    </RNHostView>
                  ) : null}
                  <Text
                    style={[{ color: colors.foreground }, { fontSize: 14, fontWeight: "600" }]}
                  >
                    {item.chefName}
                  </Text>
                </Row>
              </Host>
            </View>
          ) : null}
        </View>
      </Card>

      <Host
        aria-hidden
        matchContents={{ horizontal: false, vertical: true }}
        pointerEvents="none"
        useViewportSizeMeasurement
        style={{ width: "100%" }}
      >
        <Column spacing={6}>
          <Text
            numberOfLines={1}
            style={[{ color: colors.foreground }, {
              fontSize: 24,
              fontWeight: "600",
              lineHeight: 30,
              letterSpacing: -0.8,
            }]}
          >
            {item.title}
          </Text>
          <Row alignment="center" spacing={8}>
            <Text
              style={[{ color: colors.primary }, { fontSize: 16, fontWeight: "600" }]}
            >
              {item.duration}
            </Text>
            <Text
              style={[{ color: colors.mutedForeground }, { fontSize: 16 }]}
            >
              •
            </Text>
            <Text
              style={[{ color: colors.mutedForeground }, { fontSize: 16 }]}
            >
              {item.subtitle}
            </Text>
          </Row>
        </Column>
      </Host>
    </SafePressable>
  );
}
