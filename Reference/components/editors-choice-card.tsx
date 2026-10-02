import { Host } from "@/components/Universal/host";
import { Icon, icons } from "@/components/Universal/icon";
import {
  Column,
  RNHostView,
  Row,
  Spacer,
} from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Image } from "@/components/ui/image";
import { SafePressable } from "@/components/ui/safe-pressable";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";
import type { EditorsChoiceRecipe } from "@/types/home.types";
import { type ReactNode } from "react";
import { View } from "react-native";

interface EditorsChoiceCardProps {
  item: EditorsChoiceRecipe;
  imageHeight: number;
  onPress: () => void;
}

export function EditorsChoiceCard({
  item,
  imageHeight,
  onPress,
}: EditorsChoiceCardProps) {
  const { colors, tokens } = useTheme();

  return (
    <SafePressable
      accessibilityHint="Opens recipe details"
      accessibilityLabel={`${item.title}. ${item.duration}. ${item.secondaryMeta}`}
      onPress={onPress}
    >
      <Card style={{ overflow: "hidden" }}>
        <Image
          source={{ uri: item.imageUri }}
          contentFit="cover"
          transition={200}
          style={{ width: "100%", height: imageHeight }}
        />

        <Host
          aria-hidden
          matchContents={{ horizontal: false, vertical: true }}
          pointerEvents="none"
          useViewportSizeMeasurement
          style={{
            width: "100%",
            paddingHorizontal: 20,
            paddingBottom: 24,
            paddingTop: 16,
          }}
        >
          <Column spacing={4}>
            <Row alignment="center" spacing={12}>
              <Column
                style={{
                  borderRadius: 9999,
                  backgroundColor: colors.muted,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={[{ color: colors.mutedForeground }, {
                    fontSize: 12,
                    fontWeight: "600",
                    letterSpacing: 2,
                  }]}
                >
                  {item.label}
                </Text>
              </Column>

              {item.chefName ? (
                <>
                  <Spacer flexible />
                  <RNHostView matchContents>
                    <View
                      style={[
                        tokens.shadows.floatingAction,
                        {
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          borderRadius: 9999,
                          backgroundColor: colors.card,
                          padding: 6,
                          paddingRight: 12,
                        },
                      ]}
                    >
                      {item.chefAvatarUrl ? (
                        <Image
                          source={{ uri: item.chefAvatarUrl }}
                          style={{ width: 32, height: 32, borderRadius: 9999 }}
                          contentFit="cover"
                        />
                      ) : null}
                      <Text
                        style={[{ color: colors.foreground }, { fontSize: 14, fontWeight: "600" }]}
                      >
                        {item.chefName}
                      </Text>
                    </View>
                  </RNHostView>
                </>
              ) : null}
            </Row>

            <Column spacing={8}>
              <Text
                style={[{ color: colors.foreground }, {
                  fontSize: 26,
                  fontWeight: "600",
                  lineHeight: 32,
                  letterSpacing: -0.9,
                }]}
              >
                {item.title}
              </Text>
              <Text
                style={[{ color: colors.mutedForeground }, { fontSize: 18, lineHeight: 28 }]}
              >
                {item.description}
              </Text>
            </Column>

            <Row alignment="center" spacing={24}>
              <RecipeMeta
                icon={<Icon name={icons.clock} size={15} color="#ef4444" />}
                value={item.duration}
              />
              <RecipeMeta
                icon={
                  item.secondaryMetaKind === "flame" ? (
                    <Icon name={icons.flame} size={15} color="#ef4444" />
                  ) : (
                    <Icon name={icons.star} size={15} color="#ef4444" />
                  )
                }
                value={item.secondaryMeta}
              />
            </Row>
          </Column>
        </Host>
      </Card>
    </SafePressable>
  );
}

interface RecipeMetaProps {
  icon: ReactNode;
  value: string;
}

function RecipeMeta({ icon, value }: RecipeMetaProps) {
  const { colors } = useTheme();

  return (
    <Row alignment="center" spacing={8}>
      {icon}
      <Text
        style={[{ color: colors.mutedForeground }, { fontSize: 16, fontWeight: "500" }]}
      >
        {value}
      </Text>
    </Row>
  );
}
